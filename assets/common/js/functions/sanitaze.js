const moment = require("moment");
require('moment/locale/fr');

function sanitizeString(chaine){
    chaine.trim();

    let spe = [' ', '<', '>', '\'', 'é', 'è', 'ê', 'ë', 'á', 'ä', 'à', 'â', 'î', 'ï', 'ö', 'ô', 'ù', 'û',
        'É', 'È', 'Ê', 'Ë', 'À', 'Â', 'Á', 'Î', 'Ï', 'Ô', 'Ù', 'Û', 'ç','Ç'];
    let changer = ['-', '-', '-', '', 'e','e','e','e','á','a','a','a','i','i','o','o','u','u',
        'E','E','E','E','A','A','A','I','I','O','U','U','c','C'];

    spe.forEach((elem, index) => {
        chaine = chaine.replace(elem, changer[index]);
    })
    chaine = chaine.replace(/\s+/g, '-');
    chaine = chaine.toLowerCase();

    return chaine;
}

function addZeroToNumber (data) {
    return data > 9 ? data : "0" + data;
}

function capitalize(elem) {
    if(elem.length !== 0){
        let first = elem.substring(0, 1);
        elem = elem.substring(1);
        elem = first.toUpperCase() + elem;
    }

    return elem;
}

function removeAccents (str) {
    const accentsMap = {
        a: 'á|à|ã|â|À|Á|Ã|Â',
        e: 'é|è|ê|É|È|Ê',
        i: 'í|ì|î|Í|Ì|Î',
        o: 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
        u: 'ú|ù|û|ü|Ú|Ù|Û|Ü',
        c: 'ç|Ç',
        n: 'ñ|Ñ',
    };

    for (let pattern in accentsMap) {
        str = str.replace(new RegExp(accentsMap[pattern], 'g'), pattern);
    }

    return str;
}

function toFormatPhone(elem){
    if(elem !== "" && elem !== undefined && elem !== null){
        let arr = elem.match(/[0-9-+]/g);
        if(arr != null) {
            elem = arr.join('');
            if (!(/^((\+)33|0)[1-9](\d{2}){4}$/.test(elem))) {
                return elem;
            } else {
                let a = elem.substr(0, 2);
                let b = elem.substr(2, 2);
                let c = elem.substr(4, 2);
                let d = elem.substr(6, 2);
                let e = elem.substr(8, 2);

                return a + " " + b + " " + c + " " + d + " " + e;
            }
        }
        return elem;
    }else{
        return "";
    }
}

function toFormatCurrency(number, noSymbole = false)
{
    if(number){
        let num = new Intl.NumberFormat("de-DE", {style: "currency", currency: "EUR"}).format(number)

        let main = num.substring(0, num.length - 5);
        let decimale = num.substring(num.length - 5, num.length - 2);
        if(decimale === ",00"){
            decimale = "";
        }
        num = main + decimale + (noSymbole ? "" : " €");

        return num.replaceAll('.', ' ');
    }

    return "0,00" + (noSymbole ? "" : "€");
}

function toFormatBytesToSize(bytes) {
    let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function toFormatCalendar(value, retour = "") {
    if(value){
        return moment(value).calendar().replace(":", "h")
    }

    return retour;
}

function toDateFormat(date, format = 'LLL', retour = "", replaceHours = true) {
    if(date === null) return retour;
    return replaceHours
        ? moment(date).format(format).replace(':', 'h')
        : moment(date).format(format)
    ;
}

module.exports = {
    sanitizeString,
    addZeroToNumber,
    capitalize,
    removeAccents,
    toFormatPhone,
    toFormatCurrency,
    toFormatBytesToSize,
    toFormatCalendar,
    toDateFormat,
}
