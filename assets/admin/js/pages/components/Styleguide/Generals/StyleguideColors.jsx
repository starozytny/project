import React, { useState, useEffect } from "react";
import toastr from "toastr";

export function StyleguideColors ()
{
    const [copy, setCopy] = useState(null);

    useEffect(() => {
        if(copy){
            toastr.info(copy, "Copié dans le presse papier")
            navigator.clipboard.writeText(copy+"").then(r => setCopy(null));
        }
    });


    let colorsCustoms = [
        {shortname: 'Color 0', name: 'color0', value: '#121420'},
        {shortname: 'Color 1', name: 'color1', value: '#1b2432'},
        {shortname: 'Color 2', name: 'color2', value: '#2c2b3c'},
        {shortname: 'Color 3', name: 'color3', value: '#403f4c'},
        {shortname: 'Color 4', name: 'color4', value: '#605f6b'},
    ]
    let colorsCustomsOpacity4 = [
        {shortname: '[0.4] Color 0', name: 'color0Opacity4', value: 'rgba(18, 20, 32, 0.4)'},
        {shortname: '[0.4] Color 1', name: 'color1Opacity4', value: 'rgba(27, 36, 50, 0.4)'},
        {shortname: '[0.4] Color 2', name: 'color2Opacity4', value: 'rgba(44, 43, 60, 0.4)'},
        {shortname: '[0.4] Color 3', name: 'color3Opacity4', value: 'rgba(64, 63, 76, 0.4)'},
        {shortname: '[0.4] Color 4', name: 'color4Opacity4', value: 'rgba(96, 95, 107, 0.4)'},
    ]
    let colorsCustomsOpacity1 = [
        {shortname: '[0.1] Color 0', name: 'color0Opacity1', value: 'rgba(18, 20, 32, 0.1)'},
        {shortname: '[0.1] Color 1', name: 'color1Opacity1', value: 'rgba(27, 36, 50, 0.1)'},
        {shortname: '[0.1] Color 2', name: 'color2Opacity1', value: 'rgba(44, 43, 60, 0.1)'},
        {shortname: '[0.1] Color 3', name: 'color3Opacity1', value: 'rgba(64, 63, 76, 0.1)'},
        {shortname: '[0.1] Color 4', name: 'color4Opacity1', value: 'rgba(96, 95, 107, 0.1)'},
    ]
    let basics = [
        {shortname: 'Primary', name: 'primary', value: '#1e87f0'},
        {shortname: 'Warning', name: 'warning', value: '#f7685b'},
        {shortname: 'Danger',  name: 'danger',  value: '#fdad2d'},
        {shortname: 'Success', name: 'success', value: '#2ed47a'},
    ]
    let basicsOpacity4 = [
        {shortname: '[0.4] Primary', name: 'primaryOpacity4', value: 'rgba(30, 135, 240, 0.1)'},
        {shortname: '[0.4] Warning', name: 'warningOpacity4', value: 'rgba(253, 173, 45, 0.1)'},
        {shortname: '[0.4] Danger',  name: 'dangerOpacity4',  value: 'rgba(247, 104, 91, 0.1)'},
        {shortname: '[0.4] Success', name: 'successOpacity4', value: 'rgba(46, 212, 122, 0.1)'},
    ]
    let basicsOpacity1 = [
        {shortname: '[0.1] Primary', name: 'primaryOpacity1', value: 'rgba(30, 135, 240, 0.4)'},
        {shortname: '[0.1] Warning', name: 'warningOpacity1', value: 'rgba(253, 173, 45, 0.4)'},
        {shortname: '[0.1] Danger',  name: 'dangerOpacity1',  value: 'rgba(247, 104, 91, 0.4)'},
        {shortname: '[0.1] Success', name: 'successOpacity1', value: 'rgba(46, 212, 122, 0.4)'},
    ]
    let greys = [
        {shortname: 'Grey 0', name: 'grey0', value: '#fafafa'},
        {shortname: 'Grey 1', name: 'grey1', value: '#e8e8e8'},
        {shortname: 'Grey 2', name: 'grey2', value: '#c7c7c7'},
        {shortname: 'Grey 3', name: 'grey3', value: '#a6a6a6'},
        {shortname: 'Grey 4', name: 'grey4', value: '#838383'},
    ]
    let greysOpacity4 = [
        {shortname: '[0.4] Grey 0', name: 'grey0Opacity4', value: 'rgba(250, 250, 250, 0.1)'},
        {shortname: '[0.4] Grey 1', name: 'grey1Opacity4', value: 'rgba(232, 232, 232, 0.1)'},
        {shortname: '[0.4] Grey 2', name: 'grey2Opacity4', value: 'rgba(199, 199, 199, 0.1)'},
        {shortname: '[0.4] Grey 3', name: 'grey3Opacity4', value: 'rgba(166, 166, 166, 0.1)'},
        {shortname: '[0.4] Grey 4', name: 'grey4Opacity4', value: 'rgba(131, 131, 131, 0.1)'},
    ]
    let greysOpacity1 = [
        {shortname: '[0.1] Grey 0', name: 'grey0Opacity1', value: 'rgba(250, 250, 250, 0.4)'},
        {shortname: '[0.1] Grey 1', name: 'grey1Opacity1', value: 'rgba(232, 232, 232, 0.4)'},
        {shortname: '[0.1] Grey 2', name: 'grey2Opacity1', value: 'rgba(199, 199, 199, 0.4)'},
        {shortname: '[0.1] Grey 3', name: 'grey3Opacity1', value: 'rgba(166, 166, 166, 0.4)'},
        {shortname: '[0.1] Grey 4', name: 'grey4Opacity1', value: 'rgba(131, 131, 131, 0.4)'},
    ]

    return <div className="styleguide-content-col">
        <section className="styleguide-section">
            <div className="styleguide-section-title">Custom</div>
            <div className="styleguide-section-content">
                <div className="styleguide-colors">
                    <div className="styleguide-colors-line">
                        <Colors data={colorsCustoms} onCopy={setCopy} />
                    </div>
                    <div className="styleguide-colors-line">
                        <Colors data={colorsCustomsOpacity4} onCopy={setCopy} />
                    </div>
                    <div className="styleguide-colors-line">
                        <Colors data={colorsCustomsOpacity1} onCopy={setCopy} />
                    </div>
                </div>
            </div>
        </section>
        <section className="styleguide-section">
            <div className="styleguide-section-title">Basic</div>
            <div className="styleguide-section-content">
                <div className="styleguide-colors">
                    <div className="styleguide-colors-line">
                        <Colors data={basics} onCopy={setCopy} />
                    </div>
                    <div className="styleguide-colors-line">
                        <Colors data={basicsOpacity4} onCopy={setCopy} />
                    </div>
                    <div className="styleguide-colors-line">
                        <Colors data={basicsOpacity1} onCopy={setCopy} />
                    </div>
                </div>
            </div>
        </section>
        <section className="styleguide-section">
            <div className="styleguide-section-title">Greys</div>
            <div className="styleguide-section-content">
                <div className="styleguide-colors">
                    <div className="styleguide-colors-line">
                        <Colors data={greys} onCopy={setCopy} />
                    </div>
                    <div className="styleguide-colors-line">
                        <Colors data={greysOpacity4} onCopy={setCopy} />
                    </div>
                    <div className="styleguide-colors-line">
                        <Colors data={greysOpacity1} onCopy={setCopy} />
                    </div>
                </div>
            </div>
        </section>
    </div>
}

function Colors ({ data, onCopy }) {
    return data.map((elem, index) => {
        return <Color elem={elem} onCopy={onCopy} key={index} />
    })
}

function Color ({ elem, onCopy }) {
    return <div className={`item item-${elem.name}`} >
        <div className="item-header" onClick={() => onCopy(elem.value)}>
            <span>{elem.value}</span>
        </div>
        <div className="item-body" onClick={() => onCopy(`--${elem.name}`)}>{elem.shortname}</div>
    </div>
}
