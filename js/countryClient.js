import CountryService from './country.js';

const countrySvc = new CountryService();

const createForm = document.querySelector('#create-form');

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

const deleteForm = document.querySelector('#delete-form');

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