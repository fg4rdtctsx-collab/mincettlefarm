import app from "./app";
import { logger } from "./lib/logger";
import { seedSandboxInventory, reconcileAbandonedOrders } from "./lib/checkout";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

await seedSandboxInventory();
let checking = false;
setInterval(async () => {
  if (checking) return;
  checking = true;
  try { await reconcileAbandonedOrders(); }
  catch { logger.warn("Background invoice reconciliation unavailable; preserving verified states and reservations"); }
  finally { checking = false; }
}, 30000).unref();
app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
