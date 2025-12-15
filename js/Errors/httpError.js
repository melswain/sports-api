// Custom error class
// httpError.js

export class HttpError extends Error {
    constructor(message, code = 'EHTTPERROR', details) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.details = details;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}