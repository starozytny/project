import React from 'react';
import PropTypes from 'prop-types';

// import Routing     from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import Trumbowyg from 'react-trumbowyg';
import 'react-trumbowyg/dist/trumbowyg.min.css';
import '@nodeModulesFolder/trumbowyg/dist/plugins/base64/trumbowyg.base64';
import '@nodeModulesFolder/trumbowyg/dist/plugins/cleanpaste/trumbowyg.cleanpaste';
import '@nodeModulesFolder/trumbowyg/dist/plugins/colors/trumbowyg.colors';
import '@nodeModulesFolder/trumbowyg/dist/plugins/colors/ui/sass/trumbowyg.colors.scss';
import '@nodeModulesFolder/trumbowyg/dist/plugins/fontsize/trumbowyg.fontsize';
import '@nodeModulesFolder/trumbowyg/dist/plugins/pasteimage/trumbowyg.pasteimage';
import '@nodeModulesFolder/trumbowyg/dist/plugins/history/trumbowyg.history';
import '@nodeModulesFolder/trumbowyg/dist/plugins/upload/trumbowyg.upload';

import { Structure } from "@commonComponents/Elements/Fields";

export function Trumb (props){
    const { identifiant, valeur, onChange, errors, url, reference, children } = props;

    let content = <Trumbowyg id={identifiant}
                             buttons={
                                 [
                                     ['viewHTML'],
                                     ['historyUndo', 'historyRedo'],
                                     ['formatting'],
                                     ['fontsize'],
                                     'btnGrp-semantic',
                                     ['link'],
                                     ['insertImage'],
                                     ['upload'],
                                     ['base64'],
                                     ['foreColor', 'backColor'],
                                     'btnGrp-justify',
                                     'btnGrp-lists',
                                     ['horizontalRule'],
                                     ['fullscreen']
                                 ]
                             }
                             data={valeur}
                             placeholder=''
                             onChange={onChange}
                             ref={reference}
                             plugins= {{
                                 upload: {
                                     serverPath: url,
                                     fileFieldName: 'image',
                                     urlPropertyName: 'data.link'
                                 }
                             }}
    />

    return (<Structure {...props} content={content} label={children} />)
}

Trumb.propTypes = {
    identifiant: PropTypes.string.isRequired,
    valeur: PropTypes.node,
    errors: PropTypes.array.isRequired,
    children: PropTypes.node.isRequired,
    onChange: PropTypes.func.isRequired,
    url: PropTypes.string,
    reference: PropTypes.string,
}
