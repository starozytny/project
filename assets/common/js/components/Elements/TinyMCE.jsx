import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import Routing from '@publicFolder/bundles/fosjsrouting/js/router.min.js';

import { Structure } from "@commonComponents/Elements/Fields";
import { Editor } from "@tinymce/tinymce-react";

const URL_UPLOAD_IMAGE = 'intern_api_images_upload';

export function TinyMCE (props){
    const { identifiant, valeur, type, params, onUpdateData, children } = props;

    const editorRef = useRef(null);
    const [val, setVal] = useState(valeur);

    const handleChange = () => {
        if(editorRef && editorRef.current){
            onUpdateData(identifiant, editorRef.current.getContent());
        }
    }

    let parametres = params
        ? {...{'type': type}, ...params}
        : {'type': type}
    ;

    let content = <Editor
        tinymceScriptSrc={location.origin + '/tinymce/tinymce.min.js'}
        onInit={(evt, editor) => editorRef.current = editor}
        id={identifiant}
        initialValue={val}
        init={{
            menubar: false,
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount',
                'image', 'autoresize', 'emoticons'
            ],
            toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | image emoticons | ' +
                'alignleft aligncenter alignright alignjustify | ' +
                'bullist numlist outdent indent | ' +
                'removeformat | help',
            content_style: 'body { font-family:Barlow,Helvetica,Arial,sans-serif; font-size:14px }',
            automatic_uploads: true,
            images_upload_url: Routing.generate(URL_UPLOAD_IMAGE, parametres),
        }}
        onChange={handleChange}
    />

    return (<Structure {...props} content={content} label={children} />)
}

TinyMCE.propTypes = {
    identifiant: PropTypes.string.isRequired,
    type: PropTypes.number.isRequired,
    valeur: PropTypes.node,
    errors: PropTypes.array.isRequired,
    children: PropTypes.node,
    params: PropTypes.object,
    onUpdateData: PropTypes.func.isRequired,
}
