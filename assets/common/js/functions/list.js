const axios      = require("axios");
const Routing    = require('@publicFolder/bundles/fosjsrouting/js/router.min.js');

const Formulaire = require("@commonFunctions/formulaire");
const SearchFunction = require("@commonFunctions/search");

function getData (self, routName, perPage, sorter) {
    axios({ method: "GET", url: Routing.generate(routName), data: {} })
        .then(function (response) {
            let data = response.data;
            if(sorter) data.sort(sorter);
            let currentData = data.slice(0, perPage);
            self.setState({ data: data, dataImmuable: data, currentData: currentData, loadingData: false })
        })
        .catch(function (error) { Formulaire.displayErrors(self, error); })
    ;
}

function search (self, type, search, dataImmuable, perPage, sorter, haveFilter=false, filters, filterFunction) {
    if(haveFilter) {
        dataImmuable = filterFunction(filters);
    }
    if(search !== ""){
        let newData = SearchFunction.search(type, dataImmuable, search);
        if(sorter) newData.sort(sorter);
        self.setState({ data: newData, currentData: newData.slice(0, perPage) });
    }
}

function update (context, data, element) {
    let newData = [];

    switch (context){
        case "delete_group":
            data.forEach(el => {
                if(!element.includes(el.id)){
                    newData.push(el);
                }
            })
            break;
        case "delete":
            newData = data.filter(el => el.id !== element.id);
            break;
        case "update":
            data.forEach(el => {
                if(el.id === element.id){
                    el = element;
                }
                newData.push(el);
            })
            break;
        default:
            newData = data ? data : [];
            newData.push(element);
            break;
    }

    return newData;
}

function updateData (element, context, data, sorter,) {
    let newData = update(context, data, element);
    if(sorter){
        newData.sort(sorter)
    }

    return newData;
}

function updateListPagination (self, element, context, data, dataImmuable, currentData, sorter) {
    let newData = updateData(element, context, data, sorter);
    let newDataImmuable = updateData(element, context, dataImmuable, sorter);
    let newCurrentData = updateData(element, context, currentData, sorter);

    self.setState({
        data: newData,
        dataImmuable: newDataImmuable,
        currentData: newCurrentData,
        element: element
    })
}

function updatePerPage (self, data, perPage, sorter) {
    if(sorter) {
        data.sort(sorter)
    }

    self.setState({
        data: data,
        currentData: data.slice(0, perPage),
        perPage: perPage,
        sorter: sorter,
    })
}

module.exports = {
    getData,
    search,
    updateListPagination,
    updatePerPage,
}
