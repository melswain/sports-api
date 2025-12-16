import GetService from './getService.js';

const getService = new GetService();

const getBiomesForm = document.querySelector('#get-biomes-form');
const getButtonsForm = document.querySelector('#get-buttons-form');
const getSportForm = document.querySelector('#get-sports-form');

const biomesTBody = document.querySelector('#biomes-tbody');
const buttonsTBody = document.querySelector('#buttons-tbody');
const leaguesTbody = document.querySelector('#leagues-tbody');

const biomesPagination = document.querySelector('#biomes-pagination');
const buttonsPagination = document.querySelector('#buttons-pagination');

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

function renderButtonsTable(tbody, list) {
    if (!tbody) return;
    const table = document.getElementById("buttons-table");
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
            valueToString(item.button_id),
            valueToString(item.mouse_id),
            valueToString(item.name),
            valueToString(item.programmable)
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
        loadBiomes(1);
    });
}

async function loadBiomes(page) {
    const data = {
        name: getBiomesForm.filter_name.value,
        ecosystem_type: getBiomesForm.filter_ecosystem.value,
        climate: getBiomesForm.filter_climate.value,
        page: page
    };

    try {
        const result = await getService.getBiomes(data);

        showAlert('success', 'Biomes loaded successfully. Scroll down to see them!', 'biomes');

        renderBiomesTable(biomesTBody, result.data);
        renderPagination(biomesPagination, result.meta, (newPage) => loadBiomes(newPage));
    } catch (error) {
        console.error('Get error:', error);
        showAlert('danger', `Failed to load biomes. ${extractApiMessage(error)}`, 'biomes');
    }
}

if (getButtonsForm) {
    getButtonsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loadButtons(1);
    });
}

async function loadButtons(page) {
    const id = getButtonsForm.mouse_id.value;

    try {
        const result = await getService.getButtons(id, page);
        console.log('Get result:', result);

        showAlert('success', 'Buttons have loaded successfully. Scroll down to see them!', 'buttons');

        renderButtonsTable(buttonsTBody, result.data);
        renderPagination(buttonsPagination, result.meta, (newPage) => loadButtons(newPage));
    } catch (error) {
        console.error('Get error:', error);
        showAlert('danger', `Failed to load buttons. ${extractApiMessage(error)}`, 'buttons');
    }
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

            showAlert('success', 'Leagues have loaded successfully. Scroll down to see them!', 'sports');

            renderLeaguesTable(leaguesTbody, items);
            getSportForm.reset();
        } catch (error) {
            console.error('Get error:', error);
            showAlert('danger', `Failed to load leagues. ${extractApiMessage(error)}`, 'sports');
        }
    });
}

function renderPagination(container, meta = {}, onPage) {
    if (!container) return;
    container.innerHTML = '';

    const page = Number(meta.current_page) || 1;
    const totalPages = Number(meta.total_pages)|| 1;

    const info = document.createElement('span');
    info.textContent = `Page ${page} of ${totalPages}`;
    container.appendChild(info);

    function makeBtn(text, disabled, handler) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = text;
        btn.disabled = !!disabled;
        btn.addEventListener('click', handler);
        return btn;
    }

    const firstBtn = makeBtn('<< First', page <= 1, () => onPage(1));
    const prevBtn = makeBtn('< Previous', page <= 1, () => onPage(Math.max(1, page - 1)));
    const nextBtn = makeBtn('Next >', page >= totalPages, () => onPage(Math.min(totalPages, page + 1)));
    const lastBtn = makeBtn('Last >>', page >= totalPages, () => onPage(totalPages));

    container.appendChild(firstBtn);
    container.appendChild(prevBtn);

    container.appendChild(nextBtn);
    container.appendChild(lastBtn);
}

function showAlert(type, message, thing) {
    const container = document.getElementById(`${thing}-alert`);
    if (!container) return;

    container.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

function extractApiMessage(err) {
    try {
        const jsonStart = err.message.indexOf('{');
        if (jsonStart === -1) return err.message;

        const jsonText = err.message.slice(jsonStart);
        const parsed = JSON.parse(jsonText);

        return parsed.message;
    } catch {
        return err.message;
    }
}