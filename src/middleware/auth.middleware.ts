import { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../configs/auth.js";
import { AuthenticationError } from "../utils/errors.js";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    throw new AuthenticationError(
      "You need to sign in before you can access this route.",
    );
  }

  req.user = session.user;
  next();
}
