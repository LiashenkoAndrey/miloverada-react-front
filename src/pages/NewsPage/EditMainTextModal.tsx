import React, {FC, useRef, useState} from 'react';
import {Button, Modal} from "antd";
import HtmlEditor from "../../components/HtmlEditor";
import {Editor as TinyMCEEditor} from "tinymce";

interface EditMainTextModalProps {
    setText :  React.Dispatch<React.SetStateAction<string | undefined>>
    text : string | undefined
}

const EditMainTextModal:FC<EditMainTextModalProps> = ({setText, text}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const editorRef = useRef<TinyMCEEditor | null>(null);
    const showModal = () => {
        setIsModalOpen(true);
    };

    const getEditorText  = () : string => {
        if (editorRef.current) {
            if (editorRef.current) {
                return  editorRef.current.getContent();
            }
        }
        return ""
    }
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    return (
        <>
            {text &&
                <div onClick={() => setIsModalOpen(true)} className={"newsText"} dangerouslySetInnerHTML={{__html: text}}></div>
            }
            <Modal width={"90vw"} title={false} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <HtmlEditor
                    initVal={text}
                    onInit={(evt, editor) => {
                            editorRef.current = editor
                            }}
                            onChange={() => setText(getEditorText)}
                />
            </Modal>
        </>
    );
};

export default EditMainTextModal;