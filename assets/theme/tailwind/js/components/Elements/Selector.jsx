import React, { Component } from 'react';

export class Selector extends Component {
    constructor(props) {
        super(props);

        let isChecked = false;
        props.elements.forEach(el => {
            if(el.id === props.elem.id){
                isChecked = true;
            }
        })

        this.state = {
            isChecked: isChecked
        }
    }

    // from fo uncheck via toolbar filter checked
    handleChange = (e) => {
        const { elem } = this.props;

        let isChecked = !!(e.currentTarget.checked)

        if(isChecked){
            this.props.onSelectors(elem, "create")
        }else{
            this.props.onSelectors(elem, "delete")
        }

        this.setState({ isChecked })
    }

    render () {
        const { elem } = this.props;
        const { isChecked } = this.state;

        let id = elem.id;
        let identifiant = 'item-selector-' + elem.id;

        let styleInput = "group-hover/item:ring-blue-700 relative w-5 h-5 cursor-pointer py-2 pl-2 rounded-md border-0 text-gray-900 ring-1 ring-inset placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-500"
        let styleCheck = "absolute top-0.5 left-0.5 w-4 h-4 opacity-0 rounded bg-blue-700 flex items-center justify-center"

        return <div>

            <label htmlFor={identifiant} className="cursor-pointer flex items-center text-gray-900 group/item">
                <div className={`${styleInput} ${isChecked ? "ring-blue-700" : "ring-gray-300"}`}>
                    <div className={`${styleCheck} ${isChecked ? "opacity-100" : "opacity-0"}`}>
                        <span className="icon-check1 text-slate-50 text-xs"></span>
                    </div>
                </div>
                <input type="checkbox" name="filters" className="hidden"
                       id={identifiant} value={id} onChange={this.handleChange} />
            </label>
        </div>
    }
}
