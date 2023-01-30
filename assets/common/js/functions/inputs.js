const datepicker = require("js-datepicker");
const moment = require("moment");
require("moment/locale/fr");

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

function timeInput (e, source) {
    let value = e.currentTarget.value;

    if(value.length > 5){
        return source;
    }

    if(value.length === 3){
        let hours = value.slice(0,2);
        let minutes = value.slice(2,4);

        if(minutes !== "h"){
            return hours + "h" + minutes;
        }
    }

    return value;
}

module.exports = {
    initDateInput,
    dateInput,
    timeInput,
}
