import React from 'react';

export function UserRead ({ elem }) {
    console.log(elem);
    return <div className="page-profil-0">
        <div className="page-profil-header">
            <div className="profil-header-avatar">
                {elem.avatarFile
                    ? <img src={elem.avatarFile} alt="avatar"/>
                    : <div className="avatar-letter">{elem.lastname.slice(0,1) + elem.firstname.slice(0,1)}</div>
                }
            </div>
            <div className="profil-header-infos">
                <div className="name">{elem.lastname} {elem.firstname}</div>
                <div className="sub">ID: {elem.username}</div>
            </div>
        </div>

        <div className="page-profil-body">
            <div className="col-1">
                <div className="profil-card">
                    <div className="title">Détails</div>
                    <div className="content-infos content-infos-details">
                        <div className="item">
                            <span className="icon-shield" />
                            <div>
                                <span className={"badge badge-user-" + elem.highRoleCode}>{elem.highRole}</span>
                            </div>
                        </div>
                        <div className="item">
                            <span className="icon-bank" />
                            <div>{elem.society.code} - {elem.society.name}</div>
                        </div>
                        <div className="item">
                            <span className="icon-settings" />
                            <div>{elem.manager}</div>
                        </div>
                        <div className="item">
                            <span className="icon-email" />
                            <div>{elem.email}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
