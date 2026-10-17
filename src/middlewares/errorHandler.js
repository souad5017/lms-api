
export function errorHandler(error, req, res, next) {
    console.error(error);

    if (res.headersSent) {
        return next(error);
    }

    let status = 500;
    let message = 'Internal server error';

    if (
        error.name === 'ValidationError' ||
        error.name === 'CastError' ||
        error.name === 'ZodError'
    ) {
        status = 400;
        message = 'Invalid request data';
    } else if (error.code === 11000) {
        status = 409;
        message = 'A resource with this value already exists';
    } else if (error.status === 404 || error.statusCode === 404) {
        status = 404;
        message = 'Resource not found';
    }

    return res.status(status).json({ message });
}
