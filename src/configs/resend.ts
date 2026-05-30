import { Resend } from "resend";
import requireEnv from "./env.checker.js";

export const resend = new Resend(requireEnv("RESEND_API_KEY"));

export const RESEND_FROM_EMAIL = requireEnv("RESEND_FROM_EMAIL");
