function process(dataImmuable, filters, property) {
    let newData = [];
    if(filters.length === 0) {
        newData = dataImmuable
    }else{
        dataImmuable.forEach(el => {
            filters.forEach(filter => {
                let push = false;
                switch (property){
                    default:
                        if(filter === el[property]){
                            push = true;
                        }
                        break;
                }

                if(push){
                    newData.filter(elem => elem.id !== el.id)
                    newData.push(el);
                }

            })
        })
    }

    return newData;
}

function filter (dataImmuable, filters, property) {
    return process(dataImmuable, filters, property);
}


module.exports = {
    filter
}
