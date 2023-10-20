import React from 'react';

import parse from 'html-react-parser';

export function Mails ({ data }) {
    console.log(data)
    return <div>
        {data.map(elem => {
            return <div key={elem.id}>
                <div>{elem.subject}</div>
                <div>{parse(elem.message)}</div>
                <br/>
                <hr/>
                <br/>
            </div>
        })}
    </div>
}
