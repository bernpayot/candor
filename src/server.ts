import express from "express";
import { errorHandler } from "./middleware/error.middleware.js";
import cors from "cors";
import helmet from "helmet";
import requireEnv from "./configs/env.checker.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./configs/auth.js";
import v1Router from "./routes/v1/index.js";
import { generalLimiter, authLimiter } from "./configs/rate.limiter.js";
import { pinoHttp } from "pino-http";
import { logger } from "./configs/logger.js";

const PORT = process.env.PORT || 3000;
const app = express();

const origin = requireEnv("CORS_ORIGIN");

const allowedOrigins = ["http://localhost:5173", origin];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};

app.set("trust proxy", 1);
app.use(helmet());
app.use(cors(options));

app.use(pinoHttp({ logger }));

app.use(generalLimiter);
app.all("/api/auth/*splat", authLimiter, toNodeHandler(auth));

app.use(express.json());
app.use("/api/v1", v1Router);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
