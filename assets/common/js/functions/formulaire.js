function updateValueCheckbox(e, items, value){
    return (e.currentTarget.checked) ? [...items, ...[value]] : items.filter(v => v !== value)
}

module.exports = {
    updateValueCheckbox,
}
