import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import global_error_handler from "./app/middlewares/globalErrorHandler";
import not_found from "./app/middlewares/notFound";
import router from "./app/routes";
import env from "./env";

// middle ware
const app = express();

// Raw body parsing for Stripe webhooks
// app.use("/api/v1/stripe/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: [env.FRONTEND_URL],
  }),
);
app.use(cookieParser());

// application routes
app.get("/", async (_req, res) => {
  res.send("hello world!");
});

app.use("/api/v1", router);

app.use(global_error_handler);
app.use(not_found);

export default app;
