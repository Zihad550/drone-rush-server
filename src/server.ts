import type { Server } from "node:http";
import mongoose from "mongoose";
import app from "./app";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import env from "./env";

let server: Server;
async function main() {
  try {
    await mongoose.connect(env.DB_URL);
    server = app.listen(env.PORT, () => {
      console.log(`app listening on port ${env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}

(async () => {
  await main();
  await seedSuperAdmin();
})();

process.on("unhandledRejection", () => {
  if (server)
    server.close(() => {
      process.exit(1);
    });
  process.exit();
});

process.on("uncaughtException", () => {
  process.exit(1);
});
