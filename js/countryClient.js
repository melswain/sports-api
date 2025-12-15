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
            alert('Country created successfully');
            createForm.reset();
        } catch (err) {
            console.error('Create error:', err);
            alert(err?.message || 'Create failed');
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
            alert('Country deleted successfully');
            deleteForm.reset();
        } catch (error) {
            console.error('Delete error:', error);
            alert(error?.message || 'Delete failed');
        }
    });
}