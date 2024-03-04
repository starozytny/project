import React from 'react';

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

import { ErrorContent } from "@tailwindComponents/Elements/Fields";

export function Trumb (props){
    const { identifiant, valeur, errors, onChange, children } = props;

    let error;
    if (errors && errors.length !== 0) {
        errors.map(err => {
            if (err.name === identifiant) {
                error = err.message
            }
        })
    }

    return <>
        <label htmlFor={identifiant} className="block text-sm font-medium leading-6 text-gray-900">
            {children}
        </label>
        <Trumbowyg id={identifiant}
                   buttons={
                       [
                           ['viewHTML'],
                           ['historyUndo', 'historyRedo'],
                           ['formatting'],
                           ['fontsize'],
                           ['bold', 'italic', 'underline', 'strikethrough'],
                           ['link'],
                           ['insertImage'],
                           ['base64'],
                           ['foreColor', 'backColor'],
                           'btnGrp-justify',
                           'btnGrp-lists',
                           ['fullscreen']
                       ]
                   }
                   data={valeur}
                   placeholder=''
                   onChange={onChange}
        />
        <ErrorContent error={error} />
    </>
}
