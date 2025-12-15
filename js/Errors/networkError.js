// Custom error class
// networkError.js

export class NetworkError extends Error {
    constructor(message, code = 'ENETWORK', details) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.details = details;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}