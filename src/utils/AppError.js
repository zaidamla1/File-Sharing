class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.statusCode = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        this.operational = true;

        Error.captureStackTrace(this, this.constructor);

    }

}

module.exports = AppError;