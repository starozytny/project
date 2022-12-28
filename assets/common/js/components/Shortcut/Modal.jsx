import React from "react";
import PropTypes from "prop-types";

import { Button } from "@commonComponents/Elements/Button";
import { Modal }  from "@commonComponents/Elements/Modal";

export function ModalDelete ({ refModal, title, children, onClick, identifiant="delete", maxWidth=414 }) {
    return <Modal ref={refModal} identifiant={identifiant} maxWidth={maxWidth} title={title}
                  content={<p>{children}</p>}
                  footer={<>
                      <Button onClick={onClick} type="primary">Confirmer la suppression</Button>
                      <div className="close-modal"><Button type="cancel">Annuler</Button></div>
                  </>}
    />
}

ModalDelete.propTypes = {
    refModal: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    identifiant: PropTypes.string,
    maxWidth: PropTypes.number,
}
