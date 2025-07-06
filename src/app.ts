import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import env from "./env";

// middle ware
const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: [
      env.NODE_ENV === "development" ? env.DEV_APP_URL : env.PRO_APP_URL,
    ],
  }),
);
app.use(cookieParser());

// application routes
app.get("/", async (req, res) => {
  res.send("hello world!");
});

app.use("/api/v1", router);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
