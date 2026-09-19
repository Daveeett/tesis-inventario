/**
 * Custom application error class with HTTP status code support.
 */
class AppError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AppError";
    }
}
export { AppError };
/**
 * Global error handler middleware.
 * Catches all errors and returns a standardized JSON response.
 */
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }
    console.error("Unhandled error:", err);
    res.status(500).json({
        success: false,
        message: "Error interno del servidor",
    });
};
export { errorHandler };
/**
 * 404 Not Found handler for unmatched routes.
 */
const notFoundHandler = (_req, res) => {
    res.status(404).json({
        success: false,
        message: "Recurso no encontrado",
    });
};
export { notFoundHandler };
