import { auth } from "../configs/auth.js";

// declaration merging

declare global {
  namespace Express {
    interface Request {
      user?: typeof auth.$Infer.Session.user;
    }
  }
}

export {};
