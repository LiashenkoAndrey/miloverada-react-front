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

                height: 600,
                menubar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'media ', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | sizeselect | fontfamily | fontsize | blocks | image | table media | fullscreen preview | ' +
                    'bold italic backcolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                font_formats : "Lato=Lato; Libre+Baskerville=Libre Baskerville; Open+Sans=Open Sans; so=Source Serif 4",
                content_style: "@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;1,300&family=Libre+Baskerville&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Source+Serif+4:opsz,wght@8..60,200..900&display=swap');",
            }}
        />
    );
};

export default HtmlEditor;