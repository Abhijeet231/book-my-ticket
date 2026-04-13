class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Bad request") {
    return new ApiError(400, message);
  }

  static unauthorised(message = "Unauthorised") {
    return new ApiError(401, message);
  }

  static conflict(message = "Conflict - User already exists") {
    return new ApiError(409, message);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(403, message);
  }

   static notFound(message = "NotFound") {
    return new ApiError(403, message);
  }
}

export default ApiError;
