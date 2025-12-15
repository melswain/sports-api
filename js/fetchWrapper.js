// fetchWrapper.js
import { HttpError } from './Errors/httpError.js';
import { NetworkError } from './Errors/networkError.js';

export default class FetchWrapper {
    constructor(baseURL = 'https://www.thesportsdb.com/api/v1/json/3/search_all_leagues.php') {
        this.baseURL = baseURL;
    }

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