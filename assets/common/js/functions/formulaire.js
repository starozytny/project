const toastr = require("toastr");

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

module.exports = {
    loader,
    setValue,
    showErrors,
    displayErrors,
    updateValueCheckbox,
}
