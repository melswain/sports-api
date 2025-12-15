import { api } from './fetchWrapper.js';
import { NetworkError, HTTPError } from './Errors/networkError.js'; // optional import if you want to handle specifics

export async function fetchCountries(timeout = 8000) {
    try {
        const data = await api.get('/api/countries', {}, timeout);
        return data;
    } catch (error) {
        throw error;
    }
}

export default class Country {
    constructor(country_id, name, iso_code, continent, epi) {
        this.country_id = country_id;
        this.name = name;
        this.iso_code = iso_code;
        this.continent = continent;
        this.epi = epi;
    }
}