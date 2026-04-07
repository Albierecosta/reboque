import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { router } from "./routes/index.js";

export const app = express();
const allowedOrigins = env.FRONTEND_URL.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origem nao permitida pelo CORS."));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

app.use("/api", router);
app.use(errorHandler);
