import React, {Component} from 'react';
import {ButtonIconDropdown} from "@commonComponents/Elements/Button";

export class Storage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            directories: props.directories
        }
    }

    render () {
        const { directories } = this.state;

        console.log(directories);

        return <div className="storage">
            <div className="storage-section">
                <div className="title">Dossiers</div>
                <div className="content-infos">
                    <div className="directories">
                        {directories.map((dir, index) => {
                            return <div className="directory" key={index}>
                                <div className="directory-header">
                                    <div className="icon">
                                        <span className="icon-folder" />
                                    </div>
                                    <div className="actions">
                                        <ButtonIconDropdown icon="more" items={[]} />
                                    </div>
                                </div>
                                <div className="directory-body">
                                    <div className="name">{dir.name}</div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </div>
    }
}
