function validateDate($value) {
    if($value === "" || $value === null){
        return {
            'code': false,
            'message': 'Ce champ doit être renseigné.'
        };
    }
    return {'code': true};
}

function validateText($value) {
    if($value === "" || $value === null){
        return {
            'code': false,
            'message': 'Ce champ doit être renseigné.'
        };
    }
    return {'code': true};
}

function validateEmail($value){
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($value)){
        return {'code': true};
    }
    return {
        'code': false,
        'message': 'Cette adresse e-mail est invalide.'
    };
}

function validateEmailConfirm($value, $valueCheck){
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($value)){

        if($value !== $valueCheck){
            return {
                'code': false,
                'isCheckError': true,
                'message': 'Les adresses e-mail ne sont pas identique.'
            };
        }

        return {'code': true};
    }
    return {
        'code': false,
        'message': 'Cette adresse e-mail est invalide.'
    };
}

function validatePassword($value, $valueCheck){
    if($value === ""){
        return {
            'code': false,
            'message': 'Ce champ doit être renseigné.'
        };
    }

    if (/^(?=.{12,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\w).*$/.test($value)){

        if($value !== $valueCheck){
            return {
                'code': false,
                'isCheckError': true,
                'message': 'Les mots de passes ne sont pas identique.'
            };
        }

        return {'code': true};
    }else{
        return {
            'code': false,
            'message': 'Le mot de passe doit contenir 1 majuscule, 1 minuscule, 1 chiffre, 1 caratère spécial et au moins 12 caractères.'
        };
    }
}

function validateArray($value){
    if($value.length <= 0){
        return {
            'code': false,
            'message': 'Ce champ doit être renseigné.'
        };
    }
    return {'code': true};
}

function validateAtLeastOne($value, $valueCheck) {
    if($value === "" && $valueCheck === ""){
        return {
            'code': false,
            'message': 'Au moins un champ doit être renseigné.'
        };
    }
    return {'code': true};
}

function validateLength($value, min, max) {
    if($value.length < min || $value.length > max){
        return {
            'code': false,
            'message': 'Ce champ doit contenir entre ' + (min + 1) + " et " + max + " caractères."
        };
    }

    return {'code': true}
}

function validateUniqueLength($value, size) {
    if ($value.length !== size) {
        return {
            'code': false,
            'message': 'Ce champ doit contenir ' + size + " caractères."
        };
    }

    return {'code': true}
}

function validateMinMax($value, $valueCheck) {
    if(parseFloat($value) > parseFloat($valueCheck)){
        return {
            'code': false,
            'message': 'La valeur MIN doit être inférieur à la valeur MAX.'
        };
    }
    return {'code': true};
}

function switchCase(element){
    let validate;
    switch (element.type) {
        case 'text':
            validate = validateText(element.value);
            break;
        case 'email':
            validate = validateEmail(element.value);
            break;
        case 'emailConfirm':
            validate = validateEmailConfirm(element.value, element.valueCheck);
            break;
        case 'array':
            validate = validateArray(element.value);
            break;
        case 'password':
            validate = validatePassword(element.value, element.valueCheck);
            break;
        case 'atLeastOne':
            validate = validateAtLeastOne(element.value, element.valueCheck);
            break;
        case 'minMax':
            validate = validateMinMax(element.value, element.valueCheck);
            break;
        case 'date':
            validate = validateDate(element.value);
            break;
        case 'length':
            validate = validateLength(element.value, element.min, element.max);
            break;
        case 'uniqueLength':
            validate = validateUniqueLength(element.value, element.size);
            break;
    }

    return validate;
}

function validateur(values, valuesIfExistes){
    let validate; let code = true;
    let errors = [];
    values.forEach(element => {
        validate = switchCase(element);
        if(!validate.code){
            code = false;
            errors.push({
                name: validate.isCheckError ? element.idCheck : element.id,
                message: validate.message
            })
        }
    });

    if(valuesIfExistes){
        valuesIfExistes.forEach(element => {
            if(element.value !== "" || element.value !== null){
                validate = switchCase(element);
                if(!validate.code){
                    code = false;
                    errors.push({
                        name: validate.isCheckError ? element.idCheck : element.id,
                        message: validate.message
                    })
                }
            }
        });
    }

    return {
        code: code,
        errors: errors
    };
}

module.exports = {
    validateur
}
