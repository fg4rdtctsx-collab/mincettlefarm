import { db } from "@workspace/db";
import { sql, type SQL } from "drizzle-orm";
import { checkoutIsSandbox } from "./checkout";
import { visitorAgent } from "./visitor-agent";
import { lookupVisitorCountry } from "./visitor-country";

const prefix = () => checkoutIsSandbox() ? "sandbox_checkout" : "live_checkout";

async function rows(statement: SQL): Promise<Record<string, unknown>[]> {
  const result = await db.execute(statement);
  return Array.isArray(result) ? result : result.rows;
}

export async function recordAnonymousVisit(v: { eventId: string; sessionId: string; path: string; referrer?: string }, agent: string, address = "") {
  const visits = sql.identifier(`${prefix()}_visits`);
  const referrer = v.referrer && /^[a-z0-9.-]+$/i.test(v.referrer) ? v.referrer.toLowerCase() : "";
  const { device, browser } = visitorAgent(agent);
  const previous = await rows(sql`select country,event_id from public.${visits} where session_id=${v.sessionId}::uuid order by created_at desc limit 1`);
  // Heartbeats never trigger a new location lookup; reuse a known session country.
  const country = String(previous[0]?.country || '') || (String(previous[0]?.event_id) === v.eventId ? '' : await lookupVisitorCountry(address));
  // Reusing an event ID updates presence, not page-view totals.
  await db.execute(sql`
    insert into public.${visits}(event_id,session_id,path,referrer,last_seen,device,browser,country)
    values(${v.eventId}::uuid,${v.sessionId}::uuid,${v.path},${referrer},now(),${device},${browser},${country})
    on conflict(event_id) do update set last_seen=now()
    where ${visits}.session_id=excluded.session_id and ${visits}.path=excluded.path
  `);
}

export async function ownerVisitors() {
  const visits = sql.identifier(`${prefix()}_visits`);
  const settings = sql.identifier(`${prefix()}_analytics_start`);
  const [totals, days, peak, recent, devices, browsers, countries, sources, pages, started] = await Promise.all([
    rows(sql`select count(distinct session_id) as all_time, count(*) as views,
      count(distinct session_id) filter(where created_at >= (date_trunc('day',now() at time zone 'Africa/Lagos') at time zone 'Africa/Lagos')) as today,
      count(distinct session_id) filter(where last_seen >= now()-interval '90 seconds') as live from public.${visits}`),
    rows(sql`with days as (select generate_series(date_trunc('day',now() at time zone 'Africa/Lagos')-interval '6 days',date_trunc('day',now() at time zone 'Africa/Lagos'),interval '1 day') as day)
      select to_char(d.day,'YYYY-MM-DD') as day,count(distinct v.session_id) as visitors,count(v.event_id) as views
      from days d left join public.${visits} v on v.created_at >= (d.day at time zone 'Africa/Lagos') and v.created_at < ((d.day+interval '1 day') at time zone 'Africa/Lagos')
      group by d.day order by d.day`),
    rows(sql`select to_char(created_at at time zone 'Africa/Lagos','YYYY-MM-DD') as day,count(distinct session_id) as visitors from public.${visits} group by 1 order by visitors desc,day desc limit 1`),
    rows(sql`with sessions as (
      select session_id,min(created_at) as first_seen,max(coalesce(last_seen,created_at)) as last_seen,count(*) as views from public.${visits} group by session_id
    ) select s.*,v.path,v.referrer,v.device,v.browser,v.country from sessions s
      join lateral (select path,referrer,device,browser,country from public.${visits} where session_id=s.session_id order by created_at desc,event_id desc limit 1) v on true
      order by s.last_seen desc,s.session_id limit 100`),
    rows(sql`select device as label,count(distinct session_id) as count from public.${visits} group by device order by count desc,label`),
    rows(sql`select browser as label,count(distinct session_id) as count from public.${visits} group by browser order by count desc,label`),
    rows(sql`select country as label,count(distinct session_id) as count from public.${visits} group by country order by count desc,label limit 250`),
    rows(sql`select coalesce(nullif(referrer,''),'Direct / unknown') as label,count(distinct session_id) as count from public.${visits} group by 1 order by count desc,label limit 10`),
    rows(sql`select path,count(*) as views from public.${visits} group by path order by views desc,path limit 10`),
    rows(sql`select started_at from public.${settings} limit 1`),
  ]);
  const n = (value: unknown) => Number(value ?? 0);
  const iso = (value: unknown) => new Date(String(value)).toISOString();
  const groups = (data: Record<string, unknown>[]) => data.map(r => ({ label: String(r.label), count: n(r.count) }));
  return {
    timezone: "Africa/Lagos", trackingStartedAt: iso(started[0]?.started_at ?? new Date()),
    live: n(totals[0]?.live), today: n(totals[0]?.today), allTime: n(totals[0]?.all_time), pageViews: n(totals[0]?.views),
    peakDay: String(peak[0]?.day ?? ""), peakVisitors: n(peak[0]?.visitors),
    days: days.map(r => ({ day: String(r.day), visitors: n(r.visitors), pageViews: n(r.views) })),
    devices: groups(devices), browsers: groups(browsers), countries: groups(countries), sources: groups(sources),
    topPages: pages.map(r => ({ path: String(r.path), views: n(r.views) })),
    recentLimit: 100,
    recent: recent.map(r => ({
      session: String(r.session_id).slice(0,8), firstSeen: iso(r.first_seen), lastSeen: iso(r.last_seen),
      path: String(r.path), referrer: String(r.referrer), device: String(r.device), browser: String(r.browser), country: String(r.country), pageViews: n(r.views),
    })),
  };
}
