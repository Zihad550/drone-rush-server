import mongoose from "mongoose";
import config from "./app/config";
import { Server } from "http";
import app from "./app";

let server: Server;
async function main() {
  try {
    await mongoose.connect(config.database_uri);
    server = app.listen(config.port, () => {
      console.log(`app listening on port ${config.port}`);
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
