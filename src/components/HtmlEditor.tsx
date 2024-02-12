import React, {FC} from 'react';
import {Editor} from "@tinymce/tinymce-react";

interface HtmlEditorProps {
    onInit : (evt: any, editor: any) => void
    onChange : () => void
    initVal? : string
    val? : string
}

const HtmlEditor: FC<HtmlEditorProps> = ({onInit, onChange, initVal, val}) => {
    return (
        <Editor
            initialValue={initVal}
            onInit={onInit}
            value={val}
            onChange={onChange}
            apiKey={"s9e7vn9jkcnp5d5ptky7olb6es0niy1s9rtf7lz0d2l5tlwi"}
            init={{
                height: 500,
                menubar: false,
                plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                ],
                toolbar: 'undo redo | formatselect | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
        />
    );
};

export default HtmlEditor;