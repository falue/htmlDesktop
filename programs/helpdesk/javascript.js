let found = false;
async function searchToru(event) {
    if(event.keyCode == 13) {
        if(!found) {
            hide('patientsListImg');
            show('patientsloading');
            await delay(1111);
            hide('patientsloading');
            show('patientsNoresults');
            found = true;
        } else {
            reset();
        }
    }
    if(gebi('patientFilter').value.length === 0) {
        reset();
    }
}

function reset() {
    show('patientsListImg');
    hide('patientsloading');
    hide('patientsNoresults');
    gebi('patientFilter').value = '';
    found = false;
}