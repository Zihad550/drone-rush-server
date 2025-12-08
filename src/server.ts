import type { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
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
