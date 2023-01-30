const toastr = require("toastr");
const datepicker = require("js-datepicker");
const moment = require("moment");
require("moment/locale/fr");

function loader(status){
    let loader = document.querySelector('#loader');
    if(status){
        loader.style.display = "flex";
    }else{
        loader.style.display = "none";
    }
}

function setValue (value, defaultValue = "") {
    return value === null ? defaultValue : value;
}

function setValueDate (value, defaultValue = "") {
    return value === null ? moment(defaultValue).format('DD/MM/YYYY') : value;
}

function showErrors(self, validate, text="Veuillez vérifier les informations transmises.", toTop = false)
{
    if(toTop){
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }
    toastr.warning(text);
    self.setState({ errors: validate.errors });
}

function displayErrors(self, error, message="Veuillez vérifier les informations transmises."){
    if(Array.isArray(error.response.data)){
        toastr.error(message);
        self.setState({ errors: error.response.data });
    }else{
        if(error.response.data.message){
            toastr.error(error.response.data.message)
        }else{
            toastr.error(message);
        }
    }
}

function updateValueCheckbox(e, items, value){
    return (e.currentTarget.checked) ? [...items, ...[value]] : items.filter(v => v !== value)
}

function initDateInput(onChangeDate, onInput) {
    let inputs = document.querySelectorAll('.js-datepicker');
    inputs.forEach(input => {
        let picker = datepicker(input, {
            onSelect: instance => {
                onChangeDate(instance.el.name, moment(instance.dateSelected).format('DD/MM/YYYY'))
            },
            formatter: (input, date, instance) => {
                input.value = date.toLocaleDateString("fr-FR")
            },
            customDays: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
            customMonths: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
        })

        input.addEventListener('change', (e) => onInput(e, picker))
    })
}

function dateInput (e, picker, source) {
    let value = e.currentTarget.value;

    if(value.length > 10){
        return source;
    }

    if (/^\d+(\/\d+)*$/.test(value)){
        value = value
            .replace(/^(\d{2})(\d)$/, "$1/$2")
            .replace(/^(\d{2}\/\d{2})(\d+)$/, "$1/$2");
    }

    return value;
}

module.exports = {
    loader,
    setValue,
    setValueDate,
    showErrors,
    displayErrors,
    updateValueCheckbox,
    initDateInput,
    dateInput,
}
