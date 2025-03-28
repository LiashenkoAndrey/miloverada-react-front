import React, {FC, useContext, useRef, useState} from 'react';
import {Modal} from "antd";
import HtmlEditor from "../../../components/shared/HtmlEditor";
import {Editor as TinyMCEEditor} from "tinymce";
import {useAuth0} from "@auth0/auth0-react";
import {checkPermission} from "../../../API/Util";
import {AuthContext} from "../../../context/AuthContext";

interface EditMainTextModalProps {
    setText :  React.Dispatch<React.SetStateAction<string | undefined>>
    text : string | undefined
    onOk? : () => void
    isLoading? : boolean
}

const EditMainTextModal:FC<EditMainTextModalProps> = ({setText, text, onOk, isLoading}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const editorRef = useRef<TinyMCEEditor | null>(null);
    const {isAuthenticated} = useAuth0()
    const {jwt} = useContext(AuthContext)

    const handleOk = () => {
        setIsModalOpen(false);
        if (onOk) {
            onOk()
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };



    return (
        <>
            {(text && checkPermission(jwt, "admin"))
                ?
                <div onClick={() => setIsModalOpen(true)} className={"newsText"}
                     dangerouslySetInnerHTML={{__html: text}}></div>
                :
                // @ts-ignore
                <div  className={"newsText"} dangerouslySetInnerHTML={{__html: text}}></div>
            }

            {isModalOpen &&
                <Modal open={isModalOpen} onCancel={handleCancel} okButtonProps={{loading : isLoading ? isLoading : false}} onOk={handleOk} width={"90vw"}>
                    <HtmlEditor
                        val={text}
                        onInit={(evt, editor) => {
                            editorRef.current = editor
                        }}
                        onChange={(str) => setText(str)}
                    />
                </Modal>

            }
        </>
    );
};

export default EditMainTextModal;