import React, {FC} from 'react';
import {Editor} from "@tinymce/tinymce-react";

interface HtmlEditorProps {
    onInit : (evt: any, editor: any) => void
    onChange : (str : string) => void
    initVal? : string
    val? : string
}

const HtmlEditor: FC<HtmlEditorProps> = ({onInit, onChange, initVal, val}) => {
    return (
        <Editor
            onEditorChange={onChange}
            initialValue={initVal}
            onInit={onInit}
            value={val}

            apiKey={"s9e7vn9jkcnp5d5ptky7olb6es0niy1s9rtf7lz0d2l5tlwi"}
            init={{
                language: 'uk',

                height: 500,
                menubar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'media ', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | language| blocks | image  | table media  | fullscreen preview | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
        />
    );
};

export default HtmlEditor;