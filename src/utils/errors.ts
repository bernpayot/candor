class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, "NOT_FOUND_ERROR");
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, 401, "AUTHENTICATION_ERROR");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 403, "UNAUTHORIZED_ERROR");
  }
}

export class RateLimitError extends AppError {
  constructor(message: string) {
    super(message, 429, "RATE_LIMIT_ERROR");
  }
}

export class JobError extends AppError {
  constructor(message: string) {
    super(message, 500, "JOB_ERROR");
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT_ERROR");
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 500, "DATABASE_ERROR");
  }
}

export class ExternalAPIError extends AppError {
  constructor(message: string) {
    super(message, 500, "EXTERNAL_API_ERROR");
  }
}

export default AppError;
