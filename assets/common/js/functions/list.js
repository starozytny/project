const axios      = require("axios");

const Formulaire     = require("@commonFunctions/formulaire");
const SearchFunction = require("@commonFunctions/search");
const FilterFunction = require("@commonFunctions/filter");

function getData (self, url, perPage, sorter, highlight) {
    axios({ method: "GET", url: url, data: {} })
        .then(function (response) {
            let data = response.data;
            if(sorter) data.sort(sorter);
            let [currentData, currentPage] = setCurrentPage(highlight, data, perPage);
            self.setState({ data: data, dataImmuable: data, currentData: currentData, currentPage: currentPage, loadingData: false })
        })
        .catch(function (error) { Formulaire.displayErrors(self, error); })
    ;
}

function setCurrentPage (highlight, data, perPage) {
    highlight = parseInt(highlight);

    let offset = 0, currentPage = 0;
    if(highlight){
        data.forEach((elem, index) => {
            if(elem.id === highlight){
                offset = index
            }
        })
    }

    let pageCount = Math.ceil(data.length / perPage);
    if(pageCount !== 0){
        currentPage = Math.trunc(offset / perPage);
    }

    let start = currentPage * perPage;
    let currentData = data.slice(start, start + perPage);

    return [currentData, currentPage]
}

function search (self, type, search, dataImmuable, perPage, sorter, haveFilter=false, filters, filterFunction) {
    if(haveFilter) {
        dataImmuable = filterFunction(filters);
    }
    let newData = dataImmuable;
    if(search !== ""){
        newData = SearchFunction.search(type, dataImmuable, search);
    }
    if(sorter) newData.sort(sorter);
    self.setState({ data: newData, currentData: newData.slice(0, perPage) });
}

function filter (self, property, dataImmuable, filters, perPage, sorter) {
    let newData = FilterFunction.filter(property, dataImmuable, filters);
    if(sorter) newData.sort(sorter);

    self.pagination.current.handlePageOne();
    self.setState({ data: newData, currentData: newData.slice(0, perPage), filters: filters });
    return newData;
}

function changePerPage (self, data, perPage, sorter) {
    self.pagination.current.handlePerPage(perPage);
    updatePerPage(self, data, perPage, sorter)
}

function changeSorter (self, data, perPage, sortersFunction, nb) {
    let sorter = sortersFunction[nb];
    updatePerPage(self, data, perPage, sorter)
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

function updateDataMuta (element, context, data, sorter) {
    let nData = [];
    switch (context){
        case "delete":
            nData = data.filter(el => el.id !== element.id);
            break;
        case "update":
            nData = data.map(el => {
                if (el.id === element.id) {
                    return { ...element, ...element };
                } else {
                    return el;
                }
            });
            break;
        default:
            nData = [...data, element];
            break;
    }

    if(sorter){
        nData.sort(sorter);
    }

    return nData;
}

function updateData (element, context, data, sorter) {
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
    filter,
    changePerPage,
    changeSorter,
    updateDataMuta,
    updateData,
    updateListPagination,
    updatePerPage,
    setCurrentPage,
}
