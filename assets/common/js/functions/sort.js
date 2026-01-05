const Sanitaze = require('@commonFunctions/sanitaze')

function compareWithoutAccent(aVal, bVal) {
    let aName = null, bName = null;
    if(aVal){
        aName = Sanitaze.removeAccents(aVal);
        aName = aName.toLowerCase();
    }

    if(bVal){
        bName = Sanitaze.removeAccents(bVal);
        bName = bName.toLowerCase();
    }

    return comparison(aName, bName);
}

function comparison (objA, objB){
    if(objA === objB){
        return 0;
    }

    if(objA === null){
        return 1;
    }
    if(objB === null){
        return -1;
    }

    return objA < objB ? -1 : 1;
}

function compareFirstname(a, b){
    return compareWithoutAccent(a.firstname, b.firstname);
}

function compareLastname(a, b){
    return compareWithoutAccent(a.lastname, b.lastname);
}

function compareUsername(a, b){
    return compareWithoutAccent(a.username, b.username);
}

function compareTitle(a, b){
    return compareWithoutAccent(a.title, b.title);
}

function compareName(a, b){
    return compareWithoutAccent(a.name, b.name);
}

function compareCreatedAt(a, b){
    return comparison(a.createdAt, b.createdAt);
}

function compareCreatedAtInverse(a, b){
    return comparison(b.createdAt, a.createdAt);
}

function compareEmail(a, b){
    return compareWithoutAccent(a.email, b.email);
}

function compareZipcode(a, b){
    return compareWithoutAccent(a.zipcode, b.zipcode);
}

function compareCity(a,b){
    return compareWithoutAccent(a.city, b.city);
}

function compareCode(a, b){
    return comparison(a.code, b.code);
}

function compareLabel(a, b){
    return comparison(a.label, b.label);
}

function compareRankThenLabel(a, b){
    if (a.rank > b.rank) {
        return 1;
    } else if (a.rank < b.rank) {
        return -1;
    }
    return comparison(a.label, b.label);
}

module.exports = {
    compareUsername,
    compareLastname,
    compareFirstname,
    compareTitle,
    compareName,
    compareCreatedAt,
    compareCreatedAtInverse,
    compareEmail,
    compareZipcode,
    compareCity,
    compareCode,
    compareRankThenLabel,
    compareLabel,
}
