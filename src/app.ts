import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
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

app.use(globalErrorHandler);
app.use(notFound);

export default app;
