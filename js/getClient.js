import GetService from './getService.js';

const getService = new GetService();

const getBiomesForm = document.querySelector('#get-biomes-form');
const getCountriesForm = document.querySelector('#get-countries-form');
const getSportForm = document.querySelector('#get-sports-form');

const biomesTBody = document.querySelector('#biomes-tbody');
const countriesTBody = document.querySelector('#countries-tbody');
const leaguesTbody = document.querySelector('#leagues-tbody');

function valueToString(v) {
    if (v === null || v === undefined) return '';
    if (typeof v === 'object') return JSON.stringify(v);
    return String(v);
}

function renderBiomesTable(tbody, list) {
    if (!tbody) return;
    const table = document.getElementById("biomes-table");
    tbody.innerHTML = '';

    if (!list.length) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 9;
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    table.style.display = "table";

    list.forEach(item => {
        const tr = document.createElement('tr');

        const cols = [
            valueToString(item.biome_id),
            valueToString(item.name),
            valueToString(item.ecosystem_type),
            valueToString(item.climate),
            valueToString(item.vegetation_type)
        ];

        cols.forEach((c, i) => {
            const td = document.createElement('td');

            td.textContent = c;
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

function renderCountriesTable(tbody, list) {
    if (!tbody) return;
    const table = document.getElementById("countries-table");
    tbody.innerHTML = '';

    if (!list.length) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 9;
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    table.style.display = "table";

    list.forEach(item => {
        const tr = document.createElement('tr');

        const cols = [
            valueToString(item.country_id),
            valueToString(item.name),
            valueToString(item.iso_code),
            valueToString(item.continent),
            valueToString(item.epi)
        ];

        cols.forEach((c, i) => {
            const td = document.createElement('td');

            td.textContent = c;
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

function renderLeaguesTable(tbody, list) {
    if (!tbody) return;
    const table = document.getElementById("leagues-table");
    tbody.innerHTML = '';

    if (!list.length) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 9;
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    table.style.display = "table";

    list.forEach(item => {
        const tr = document.createElement('tr');

        const cols = [
            valueToString(item.idLeague ?? item.idleague ?? item.ID ?? ''),
            valueToString(item.strLeague ?? item.league ?? ''),
            valueToString(item.dateFirstEvent ?? ''),
            valueToString(item.strSport ?? ''),
            valueToString(item.intFormedYear ?? ''),
            valueToString(item.strGender ?? ''),
            valueToString(item.strCountry ?? ''),
            '' // logo cell
        ];

        cols.forEach((c, i) => {
            const td = document.createElement('td');

            if (i === 7) {
                const logoUrl = item.strLogo ?? item.strBadge ?? item.strTeamBadge ?? item.strLogoSports ?? '';
                if (logoUrl) {
                    const img = document.createElement('img');
                    img.src = logoUrl;
                    img.style.maxHeight = '40px';
                    img.style.maxWidth = '80px';
                    td.appendChild(img);
                } else {
                    td.textContent = '';
                }
            } else {
                td.textContent = c;
            }
            tr.appendChild(td);
        });

        tbody.appendChild(tr);
    });
}

if (getBiomesForm) {
    getBiomesForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            name: e.target.filter_name.value,
            ecosystem_type: e.target.filter_ecosystem.value,
            climate: e.target.filter_climate.value
        };

        try {
            const result = await getService.getBiomes(data);
            console.log('Get result:', result);
            renderBiomesTable(biomesTBody, result.data);
            getBiomesForm.reset();
        } catch (err) {
            console.error('Get error:', err);
            alert(err?.message || 'Get failed');
        }
    });
}

if (getCountriesForm) {
    getCountriesForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = e.target.biome_id.value;

        try {
            const result = await getService.getCountries(id);
            console.log('Get result:', result);
            renderCountriesTable(countriesTBody, result.data);
            getCountriesForm.reset();
        } catch (error) {
            console.error('Get error:', error);
            alert(error?.message || 'Get failed');
        }
    });
}

if (getSportForm) {
    getSportForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            sport: e.target.filter_sport.value,
            country: e.target.filter_country.value
        };

        try {
            const result = await getService.getSports(data);
            console.log('Get result:', result);
            let items = result;
            if (result && typeof result === 'object') {
                if (Array.isArray(result)) items = result;
                else if (result.leagues) items = result.leagues;
                else if (result.countries) items = result.countries;
                else if (result.sports) items = result.sports;
            }
            renderLeaguesTable(leaguesTbody, items);
            getSportForm.reset();
        } catch (err) {
            console.error('Get error:', err);
            alert(err?.message || 'Get failed');
        }
    });
}