// fetchWrapper.js
import { HttpError } from '../Errors/httpError.js';
import { NetworkError } from '../Errors/networkError.js';

export default class FetchWrapper {
  constructor(baseURL = 'https://www.thesportsdb.com/api/v1/json/3/search_all_leagues.php') {
    this.baseURL = baseURL;
  }

  async request(uri, object = null) {
    try {
      let input;

      if (object instanceof Request) {
        input = object;
      } else {
        input = new Request(`${this.baseURL}${uri}`, {
          method: 'GET',
        });
      }

      const response = await fetch(input);

      if (!response.ok) {
        const errorText = await response.text();
        throw new HttpError(
          `HTTP Error ${response.status}: ${response.statusText}\n${errorText}`
        );
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
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