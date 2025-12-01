// Custom error class
// networkError.js

export class NetworkError extends Error {
  constructor(message) {
    super(`Network Error: ${message}`);
    this.name = 'NetworkError';
  }
}