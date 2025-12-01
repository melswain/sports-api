// Custom error class
// httpError.js

export class HttpError extends Error {
  constructor(status, statusText, body = '') {
    super(`HTTP Error ${status}: ${statusText}${body ? `\n${body}` : ''}`);
    this.name = 'HttpError';
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }
}