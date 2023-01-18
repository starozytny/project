const Sanitaze = require('@commonFunctions/sanitaze')

function search(type, dataImmuable, search) {
    let newData = [];
    search = search.toLowerCase();
    search = Sanitaze.removeAccents(search);
    newData = dataImmuable.filter(function(v) {
        return switchFunction(type, search, v);
    })

    return newData;
}

function searchStartWith (value, search){
    let val = Sanitaze.removeAccents(value);
    return val.startsWith(search)
}

function switchFunction(type, search, v) {
    switch (type) {
        case "user":
            if(searchStartWith(v.username.toLowerCase(), search)
                || searchStartWith(v.email.toLowerCase(), search)
                || searchStartWith(v.firstname.toLowerCase(), search)
                || searchStartWith(v.lastname.toLowerCase(), search)
            ){
                return v;
            }
            break;
        case "society":
            if(searchStartWith(v.name.toLowerCase(), search)
                || searchStartWith(v.code.toLowerCase(), search)
            ){
                return v;
            }
            break;
        case "changelog":
            if(searchStartWith(v.name.toLowerCase(), search)){
                return v;
            }
            break;
        default:
            break;
    }
}

function selectSearch (value, itemValue) {
    let search = value !== "" ? value.toLowerCase() : "";
    search = Sanitaze.removeAccents(search);

    let label = itemValue.toLowerCase();
    label = Sanitaze.removeAccents(label);

    return label.includes(search) ? 1 : 2;
}

module.exports = {
    search,
    selectSearch,
}
