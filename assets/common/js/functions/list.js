const axios = require("axios");

const Formulaire = require("@commonFunctions/formulaire");
const SearchFunction = require("@commonFunctions/search");
const FilterFunction = require("@commonFunctions/filter");

function getData (self, url, perPage, sorter, highlight = null, filters = null, filterFunction, nameHighlight = "id")
{
    axios({ method: "GET", url: url, data: {} })
        .then(function (response) {
            let data = response.data;
            let dataImmuable = response.data;

            if(filters) {
                data = filterFunction(filters, dataImmuable);
            }

            if(sorter) data.sort(sorter);
            if(sorter) dataImmuable.sort(sorter);

            let [currentData, currentPage] = setCurrentPage(highlight, data, perPage, nameHighlight);

            self.setState({ data: data, dataImmuable: dataImmuable, currentData: currentData, currentPage: currentPage, loadingData: false })
        })
        .catch(function (error) { Formulaire.displayErrors(self, error); })
    ;
}

function setCurrentPage (highlight, data, perPage, nameHighlight = "id")
{
    let offset = 0, currentPage = 0;
    if(highlight){
        highlight = parseInt(highlight);
        data.forEach((elem, index) => {
            if(elem[nameHighlight] === highlight){
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
    }else{
        if(self.pagination.current){
            self.pagination.current.handlePageOne();
        }
    }
    if(sorter) newData.sort(sorter);
    self.setState({ data: newData, currentData: newData.slice(0, perPage) });
}

function filter (self, property, dataImmuable, filters, perPage, sorter, sessionName) {
    let newData = FilterFunction.filter(dataImmuable, filters, property);
    if(sorter) newData.sort(sorter);

    if(self.pagination.current){
        self.pagination.current.handlePageOne();
    }
    self.setState({ data: newData, currentData: newData.slice(0, perPage), filters: filters });

    if(sessionName){
        sessionStorage.setItem(sessionName, JSON.stringify(filters));
    }
    return newData;
}

function filterCustom (self, filterFunction, dataImmuable, filters, perPage, sorter, sessionName) {
    let newData = filterFunction(dataImmuable, filters);
    if(sorter) newData.sort(sorter);

    if(self.pagination.current){
        self.pagination.current.handlePageOne();
    }
    self.setState({ data: newData, currentData: newData.slice(0, perPage), filters: filters });

    if(sessionName){
        sessionStorage.setItem(sessionName, JSON.stringify(filters));
    }
    return newData;
}

function changePerPage (self, data, perPage, sorter, sessionName) {
    self.pagination.current.handlePerPage(perPage);
    updatePerPage(self, data, perPage, sorter);

    if(sessionName){
        sessionStorage.setItem(sessionName, perPage);
    }
}

function changeSorter (self, data, perPage, sortersFunction, nb, sessionName = null) {
    let sorter = sortersFunction[nb];
    updatePerPage(self, data, perPage, sorter);

    if(sessionName){
        sessionStorage.setItem(sessionName, "" + nb);
    }
    self.setState({ nbSorter: nb, currentPage: 0 })
}

function updateDataMuta (element, context, data, sorter, nameProperty = "id") {
    let nData = [];
    switch (context){
        case "delete":
            nData = data.filter(el => el[nameProperty] !== element[nameProperty]);
            break;
        case "update":
            nData = data.map(el => {
                if (el[nameProperty] === element[nameProperty]) {
                    return { ...el, ...element };
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

function update (context, data, element, nameProperty = "id") {
    let nData = [];

    switch (context) {
        case "delete_group":
            data.forEach(el => {
                if (!element.includes(el[nameProperty])) {
                    nData.push(el);
                }
            })
            break;
        case "delete":
            nData = data.filter(el => el[nameProperty] !== element[nameProperty]);
            break;
        case "update":
            data.forEach(el => {
                if (el[nameProperty] === element[nameProperty]) {
                    el = element;
                }
                nData.push(el);
            })
            break;
        default:
            nData = data ? data : [];
            nData.push(element);
            break;
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

function updateListPagination (self, element, context, data, dataImmuable, currentData, sorter, toHighlight = false, perPage, nameHighlight = "id") {
    let newData = updateData(element, context, data, sorter);
    let newDataImmuable = updateData(element, context, dataImmuable, sorter);
    let newCurrentData = updateData(element, context, currentData, sorter);

    let currentPage;
    if(toHighlight){
        [newCurrentData, currentPage] = setCurrentPage(element[nameHighlight], newData, perPage);

        self.setState({ currentPage: currentPage, highlight: element[nameHighlight] })
    }

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

function getSessionSorter (sessionName, sorter, sortersFunction, nb = 0) {
    let saveNbSorter = sessionStorage.getItem(sessionName);
    let nbSorter = saveNbSorter !== null ? parseInt(saveNbSorter) : nb;
    if(nbSorter){
        sorter = sortersFunction[nbSorter];
    }

    return [sorter, nbSorter];
}

function getSessionPerpage (sessionName, perPage) {
    let saveNbPerPage = sessionStorage.getItem(sessionName);
    return saveNbPerPage !== null ? parseInt(saveNbPerPage) : perPage;
}

function getSessionFilters (sessionName, filters, highlight) {
    let saveFilters = highlight ? sessionStorage.getItem(sessionName) : null;
    return saveFilters !== null ? JSON.parse(saveFilters) : filters;
}

module.exports = {
    getData,
    search,
    filter,
    filterCustom,
    changePerPage,
    changeSorter,
    update,
    updateDataMuta,
    updateData,
    updateListPagination,
    updatePerPage,
    setCurrentPage,
    getSessionSorter,
    getSessionPerpage,
    getSessionFilters,
}
