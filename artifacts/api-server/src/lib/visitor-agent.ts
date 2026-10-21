/** Coarse categories only; never persist the raw user agent or IP address. */
export function visitorAgent(agent: string) {
  const device = /ipad|tablet|android(?!.*mobile)/i.test(agent) ? "Tablet"
    : /mobile|iphone|ipod/i.test(agent) ? "Mobile" : agent ? "Desktop" : "Unknown";
  const browser = /edg[ea]?\//i.test(agent) ? "Edge" : /opr\/|opera/i.test(agent) ? "Opera"
    : /firefox|fxios/i.test(agent) ? "Firefox" : /chrome|crios/i.test(agent) ? "Chrome"
    : /safari/i.test(agent) ? "Safari" : "Unknown";
  return { device, browser };
}
