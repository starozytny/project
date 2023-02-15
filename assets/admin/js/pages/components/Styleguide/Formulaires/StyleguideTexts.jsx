import React, { Component } from "react";

import Inputs from "@commonFunctions/inputs";

import { Input } from "@commonComponents/Elements/Fields";

export class StyleguideTexts extends Component
{
    constructor(props) {
        super(props);

        this.state = {
            txt1: "",
            txt2: "",
            txt3: "",
            txt4: "",
            txt5: "",
            errors: []
        }
    }

    handleChange = (e) => {
        let name = e.currentTarget.name;
        let value = e.currentTarget.value;

        if(name === "txt2") value = Inputs.textAlphaInput(e, this.state[name]);
        if(name === "txt3") value = Inputs.textNumericInput(e, this.state[name]);
        if(name === "txt4") value = Inputs.textNumericWithMinusInput(e, this.state[name]);
        if(name === "txt5") value = Inputs.textMoneyMinusInput(e, this.state[name]);

        this.setState({ [name]: value })
    }

    render () {
        const { errors, txt1, txt2, txt3, txt4, txt5 } = this.state;

        let params = {errors: errors, onChange: this.handleChange};

        return <div className="styleguide-content-col">
            <section className="styleguide-section">
                <div className="styleguide-section-title">Basic</div>
                <div className="styleguide-section-content">
                    <div className="line line-2">
                        <Input identifiant="txt1" valeur={txt1} {...params}>Text libre</Input>
                        <Input identifiant="txt2" valeur={txt2} {...params}>Text alpha uniquement</Input>
                    </div>
                    <div className="line line-2">
                        <Input identifiant="txt3" valeur={txt3} {...params}>Text numeric uniquement</Input>
                        <Input identifiant="txt4" valeur={txt4} {...params}>Text numeric +/- uniquement</Input>
                    </div>
                    <div className="line line-2">
                        <Input identifiant="txt5" valeur={txt5} {...params}>Text money</Input>
                    </div>
                </div>
            </section>
        </div>
    }


}
