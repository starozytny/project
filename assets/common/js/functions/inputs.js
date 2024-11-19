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
    getZipcodes,
    cityInput,
    textAlphaInput,
    textNumericInput,
    textNumericWithMinusInput,
    textMoneyMinusInput,
}
