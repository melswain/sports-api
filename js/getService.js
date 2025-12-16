import FetchWrapper from './fetchWrapper.js';
import { NetworkError } from './Errors/networkError.js';
import { HttpError } from './Errors/httpError.js';

export default class GetService {
    constructor() {
        this.baseURL = 'http://localhost/ecosight-api/biomes';
        this.api = new FetchWrapper(this.baseURL);
    }

    /**
     * Verifies input and returns data from the ecosight-api biomes table using the fetch wrapper
     * @param {object} param0 the filters to be applied to the query
     * @returns the json fetched result of the query
     */
    async getBiomes({ name, ecosystem_type, climate, page}) {
        if (name && (typeof name !== 'string' || !name.trim())) {
            throw new Error('Name must be a string.');
        }

        if (ecosystem_type && (typeof ecosystem_type !== 'string' || !ecosystem_type.trim())) {
            throw new Error('Ecosystem type must be a string.');
        }

        if (climate && (typeof climate !== 'string' || !climate.trim())) {
            throw new Error('Climate must be a string.');
        }

        const pageNum = Number(page);
        if (page && !Number.isFinite(pageNum) || pageNum < 0) {
            throw new Error('Page must be a non-negative number');
        }

        const params = new URLSearchParams({
            name: name.trim(),
            ecosystem_type: ecosystem_type.trim(),
            climate: climate.trim(),
            page: pageNum
        });

        const url = `${'http://localhost/ecosight-api/biomes'}?${params.toString()}`;

        console.log(params);
        console.log(url);

        try {
            return await this.api.sendRequest(url, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Verifies input and returns data from the km-api buttons table by the mouse id using the fetch wrapper
     * @param {*} id the mouse id of the buttons to be fetched
     * @param {*} page the current page of the values to be fetched
     * @returns the json fetched result of the query
     */
    async getButtons(id, page) {
        const mouse_id = Number(id);
        if (!Number.isInteger(mouse_id) || mouse_id <= 0) {
            throw new Error('ID must be a positive integer');
        }

        const pageNum = Number(page);
        if (page && !Number.isFinite(pageNum) || pageNum < 0) {
            throw new Error('Page must be a non-negative number');
        }

        const params = new URLSearchParams({
            page: pageNum
        });

        const url = `${'http://localhost/km-api/mice/'}${mouse_id}${'/buttons'}?${params.toString()}`;
        console.log(url);

        try {
            return this.api.sendRequest(url, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });
        } catch (error) {
            throw error;
        }
    }
    
    /**
     * Verifies input and returns data from the sportsdb api leagues table using the fetch wrapper
     * @param {object} param0 the filters to be applied to the query
     * @returns the json fetched result of the query
     */
    async getSports({ sport, country }) {
        if (sport && (typeof sport !== 'string' || !sport.trim())) {
            throw new Error('Sport must be a string.');
        }

        if (country && (typeof country !== 'string' || !country.trim())) {
            throw new Error('Country type must be a string.');
        }

        if (!country && !sport) {
            throw new Error('Either sport or country (or both) must be specified.');
        }

        const params = new URLSearchParams();

        if (sport && sport.trim()) {
            params.append("s", sport.trim());
        }

        if (country && country.trim()) {
            params.append("c", country.trim());
        }

        const url = `${'https://www.thesportsdb.com/api/v1/json/3/search_all_leagues.php'}?${params.toString()}`;

        console.log(params);
        console.log(url);

        try {
            return await this.api.sendRequest(url, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });
        } catch (error) {
            throw error;
        }
    }
}