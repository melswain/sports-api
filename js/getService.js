import FetchWrapper from './fetchWrapper.js';
import { NetworkError } from './Errors/networkError.js';
import { HttpError } from './Errors/httpError.js';

export default class GetService {
    constructor() {
        this.baseURL = 'http://localhost/ecosight-api/biomes';
        this.api = new FetchWrapper(this.baseURL);
    }

    async getBiomes({ name, ecosystem_type, climate }) {
        if (name && (typeof name !== 'string' || !name.trim())) {
            throw new Error('Name must be a string.');
        }

        if (ecosystem_type && (typeof ecosystem_type !== 'string' || !ecosystem_type.trim())) {
            throw new Error('Ecosystem type must be a string.');
        }

        if (climate && (typeof climate !== 'string' || !climate.trim())) {
            throw new Error('Climate must be a string.');
        }

        const params = new URLSearchParams({
            name: name.trim(),
            ecosystem_type: ecosystem_type.trim(),
            climate: climate.trim()
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

    async getCountries(id) {
        const biome_id = Number(id);
        if (!Number.isInteger(biome_id) || biome_id <= 0) {
            throw new Error('ID must be a positive integer');
        }

        const url = `${'http://localhost/ecosight-api/biomes/'}${biome_id}${'/countries'}`;
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