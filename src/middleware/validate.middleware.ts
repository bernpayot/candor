import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ValidationError } from "../utils/errors.js";

type ValidatedRequestData = {
  body?: Request["body"];
  params?: Request["params"];
};

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
    });

    if (!result.success) {
      throw new ValidationError(result.error.flatten().fieldErrors.toString());
    }

    const data = result.data as ValidatedRequestData;

    if ("body" in data) {
      req.body = data.body;
    }

    if ("params" in data) {
      req.params = data.params;
    }

    next();
  };
}
