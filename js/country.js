import FetchWrapper from './fetchWrapper.js';
import { NetworkError } from './Errors/networkError.js';
import { HttpError } from './Errors/httpError.js';

export default class CountryService {
    constructor() {
        this.baseURL = 'http://localhost/ecosight-api/countries';
        this.api = new FetchWrapper(this.baseURL);
    }

    async createCountry({ name, iso_code, continent, epi }) {
        if (!name || typeof name !== 'string' || !name.trim()) {
            throw new Error('Name is required');
        }

        if (!iso_code || typeof iso_code !== 'string' || !(iso_code.trim().length === 2 || iso_code.trim().length === 3)) {
            throw new Error('ISO code must be 2 or 3 characters');
        }

        if (!continent || typeof continent !== 'string' || !continent.trim()) {
            throw new Error('Continent is required');
        }

        const epiNum = Number(epi);
        if (!Number.isFinite(epiNum) || epiNum < 0) {
            throw new Error('EPI must be a non-negative number');
        }

        const payload = [{
            name: name.trim(),
            iso_code: iso_code.trim().toUpperCase(),
            continent: continent.trim(),
            epi: epiNum
        }]; // ecosight-api expects an array of countries

        console.log(payload);
        console.log(this.api);
        console.log(this.api.baseURL);

        try {
            return await this.api.sendRequest(this.api.baseURL, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteCountry(id) {
        const country_id = Number(id);
        if (!Number.isInteger(country_id) || country_id <= 0) {
            throw new Error('ID must be a positive integer');
        }

        try {
            return this.api.sendRequest(this.api.baseURL, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify([country_id])
            });
        } catch (error) {
            throw error;
        }
    }
    
    async fetchCountries() {
        try {
            const data = await this.api.sendRequest(this.api.baseURL, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            return data;
        } catch (error) {
            throw error;
        }
    }
}