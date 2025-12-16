import CountryService from './countryService.js';

const countrySvc = new CountryService();

const createForm = document.querySelector('#create-form');
const deleteForm = document.querySelector('#delete-form');

/**
 * Handles the form submission for country creation
 * @property {string} name the name of the country.
 * @property {string} iso_code - the ISO country code
 * @property {string} continent - the continent the country belongs to
 * @property {number|string} epi - Environmental Performance Index (epi)
 */
if (createForm) {
    createForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            name: e.target.name.value,
            iso_code: e.target.iso_code.value,
            continent: e.target.continent.value,
            epi: e.target.epi.value
        };

        try {
            const result = await countrySvc.createCountry(data);
            console.log('Create result:', result);
            showAlert('success', `Successfully created a country.`, 'post');
            createForm.reset();
        } catch (error) {
            console.error('Create error:', error);
            showAlert('danger', `Unable to create country. ${error.message}`, 'post');
        }
    });
}

/**
 * Handles the form submission for country deletion
 * @property {int} id ID of the country to be deleted
 */
if (deleteForm) {
    deleteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = e.target.id.value;

        try {
            const result = await countrySvc.deleteCountry(id);
            console.log('Delete result:', result);
            showAlert('success', `Successfully deleted country with ID ${Object.keys(result.deleted)[0]}.`, 'delete');
            deleteForm.reset();
        } catch (error) {
            console.error('Delete error:', error);
            showAlert('danger', `Unable to delete country. ${error.message}`, 'delete');
        }
    });
}

/**
 * Displays an error or a success message
 * @param {CSSStyleRule} type the alert type (danger or success) for the message
 * @param {string} message the message to be displayed
 * @param {HTMLDivElement} thing the div name where to add the message
 * @returns 
 */
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