import express from "express";
import { errorHandler } from "./middleware/error.middleware.js";
import cors from "cors";
import helmet from "helmet";
import requireEnv from "./configs/env.checker.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./configs/auth.js";

const PORT = process.env.PORT || 3000;
const app = express();

const origin = requireEnv("CORS_ORIGIN");

const allowedOrigins = ["http://localhost:3000", origin];
const options: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "DELETE"],
};

app.use(helmet());
app.use(cors(options));

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());
//'/'router coming soon
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
