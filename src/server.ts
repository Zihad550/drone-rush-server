import mongoose from "mongoose";
import { Server } from "http";
import app from "./app";
import env from "./env";

let server: Server;
async function main() {
  try {
    await mongoose.connect(env.DATABASE_URL);
    server = app.listen(env.PORT, () => {
      console.log(`app listening on port ${env.PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
}
main();

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
