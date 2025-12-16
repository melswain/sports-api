// fetchWrapper.js
import { HttpError } from './Errors/httpError.js';
import { NetworkError } from './Errors/networkError.js';

/**
 * A wrapper class for making HTTP requests using the Fetch API.
 * Provides a method to send HTTP requests with default and custom options.
 */
export default class FetchWrapper {
    constructor(baseURL = 'https://www.thesportsdb.com/api/v1/json/3/search_all_leagues.php') {
        this.baseURL = baseURL;
    }

    /**
    * Sends an HTTP request using the Fetch API.
    * @param {string} uri The URI identifying the targeted resource to which the request will be sent.
    * @param {Object} [options={}] Optional configuration object for the request.
    * @returns {Promise<Object>} A promise that resolves with the parsed JSON response body from the server.
    * @throws {Error} Throws an error if the request fails (network errors or non-2xx HTTP status codes).
    */
    async sendRequest(uri, options = {}) {
        console.log(this.baseURL);
        console.log(uri);
        //* Default options to apply to every request.
        const defaultOptions = {
            method: 'GET',
            cache: 'no-cache'
        }

        const requestOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers,
            }
        };

        try {
            const response = await fetch(uri, requestOptions);

            if (!response.ok) {
                const errorText = await response.text();
                throw new HttpError(
                    `HTTP Error ${response.status}: ${response.statusText}\n${errorText}`
                );
            }
            
            return await response.json();
        } catch (error) {
            if (error instanceof HttpError) {
                console.error(`FetchWrapper error [${uri}]:`, error.message);
                throw error;
            }

            console.error(`FetchWrapper error [${uri}]:`, error.message);
            throw new NetworkError(error.message);
        }
    }
}