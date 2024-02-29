const { useEffect } = require('react');

function useHighlight(highlight, id, refItem)
{
    let nHighlight = highlight === id;

    useEffect(() => {
        if(nHighlight && refItem.current){
            refItem.current.scrollIntoView({block: "center"})
        }
    }, [highlight])

    return nHighlight;
}

function setHighlightClass(highlight){
    return highlight ? " highlight" : ""
}

module.exports = {
    useHighlight,
    setHighlightClass
}
