function process(dataImmuable, filters, property) {
    if(filters.length === 0) return dataImmuable;

    let newData = new Map();

    dataImmuable.forEach(el => {
        for (const filter of filters) {

            let push = false;
            switch (property){
                default:
                    push = filter === el[property];
                    break;
            }

            if (push) newData.set(el.id, el);
        }
    })

    return Array.from(newData.values());
}

function filter (dataImmuable, filters, property) {
    return process(dataImmuable, filters, property);
}

module.exports = {
    filter
}
