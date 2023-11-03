const datepicker = require("js-datepicker");
const moment = require("moment");
require("moment/locale/fr");

const axios = require("axios");
const Sort = require("@commonFunctions/sort");

function processData(allText)
{
    let allTextLines = allText.split(/\r\n|\n/);
    let headers = allTextLines[0].split(';');
    let lines = [];

    for (let i=1; i<allTextLines.length; i++) {
        let data = allTextLines[i].split(';');

        lines.push({"zipcode": data[2], "city": data[1]});
    }

    return lines;
}

function getZipcodes(self, name = "arrayZipcodes")
{
    axios.get( window.location.origin + "/zipcodes.csv", {})
        .then(function (response) {
            self.setState({ [name]: processData(response.data) })
        })
    ;
}

function cityInput(self, e, source, zipcodes, nameStateCity = "city")
{
    let name = e.currentTarget.name;
    let value = e.currentTarget.value;

    if(!(/^[0-9]*$/).test(value) || value.length > 5){
        self.setState({ [name]: source, openCities: "", triggerInput: true })
    }else{
        if(value.length <= 5){
            self.setState({ [name]: value, openCities: "", triggerInput: true })

            let v = ""
            if(zipcodes.length !== 0){
                v = zipcodes.filter(el => el.zipcode === value);

                let uniqueValues = [], values = [];
                v.forEach((c) => {
                    if (!uniqueValues.includes(c.city)) {
                        uniqueValues.push(c.city);
                        values.push(c);
                    }
                });

                if(values.length === 1){
                    self.setState({ [nameStateCity]: values[0].city, openCities: "" })
                }else{
                    if(values.length > 1){
                        values.sort(Sort.compareCity)
                        self.setState({ cities: values, openCities: nameStateCity })
                    }
                }
            }
        }
    }
}

function initDateInput(onChangeDate, onInput, minDate, maxDate = new Date(2060, 0, 1)) {
    let inputs = document.querySelectorAll('.js-datepicker');
    inputs.forEach(input => {
        let picker = datepicker(input, {
            onSelect: instance => {
                onChangeDate(instance.el.name, moment(instance.dateSelected).format('DD/MM/YYYY'))
            },
            formatter: (input, date, instance) => {
                input.value = date.toLocaleDateString("fr-FR")
            },
            startDay: 1,
            customDays: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
            customMonths: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
            overlayButton: "Valider",
            overlayPlaceholder: 'Année (AAAA)',
            minDate: minDate, maxDate: maxDate,
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

function textAlphaInput (value, source) {
    if(!(/^[a-zA-Z]*$/).test(value)) value = source;
    return value;
}

function textNumericInput (value, source) {
    if(!(/^[0-9]*$/).test(value)) value = source;
    return value;
}

function textNumericWithMinusInput (value, source) {
    if(!(/^-?[0-9]*$/).test(value)) value = source;
    return value;
}

function textMoneyMinusInput (value, source) {
    if(!(/^-?[0-9.]*$/).test(value)) value = source;
    return value;
}

module.exports = {
    initDateInput,
    dateInput,
    timeInput,
    getZipcodes,
    cityInput,
    textAlphaInput,
    textNumericInput,
    textNumericWithMinusInput,
    textMoneyMinusInput,
}
