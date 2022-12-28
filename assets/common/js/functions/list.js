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
    })
}

module.exports = {
    updateListPagination,
    updatePerPage,
}
