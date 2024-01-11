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
    let val = value.toLowerCase();
    val = Sanitaze.removeAccents(val);
    return val.startsWith(search)
}

function switchFunction(type, search, v) {
    switch (type) {
        case "user":
            if(searchStartWith(v.username, search)
                || searchStartWith(v.email, search)
                || searchStartWith(v.firstname, search)
                || searchStartWith(v.lastname, search)
            ){
                return v;
            }
            break;
        case "society":
            if(searchStartWith(v.name, search)
                || searchStartWith(v.code, search)
            ){
                return v;
            }
            break;
        case "contact":
        case "changelog":
            if(searchStartWith(v.name, search)){
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
