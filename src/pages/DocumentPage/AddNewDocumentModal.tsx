import React, {FC, useContext, useEffect, useRef, useState} from 'react';
import {Button, Checkbox, Flex, Input, Modal, notification, Tour, TourProps, UploadFile, UploadProps} from "antd";
import Dragger from "antd/es/upload/Dragger";
import {InboxOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {addNewDocumentInSubGroup} from "../../API/services/DocumentService";
import {AuthContext} from "../../context/AuthContext";
import {RcFile} from "antd/es/upload/interface";
import {IDocument} from "../../API/services/InstitutionService";

interface AddNewDocumentModalProps {
    groupId? : number
    isActive : boolean
    setDoc : (doc: IDocument) => void
    setIsActive :  React.Dispatch<React.SetStateAction<boolean>>
    isTourActive : boolean
    setIsAddDocTourActive: React.Dispatch<React.SetStateAction<boolean>>
}

const AddNewDocumentModal:FC<AddNewDocumentModalProps> = ({groupId, isActive, setIsAddDocTourActive, setIsActive, setDoc, isTourActive}) => {
    const [file, setFile] = useState<RcFile>()
    const {jwt} = useContext(AuthContext)
    const [filename, setFilename] = useState<string>('')


    const props: UploadProps = {
        onRemove: (file) => {
            setFile(undefined)
        },
        beforeUpload: async (file) => {
            setFile(file);
            return true;
        },
        fileList: file && [file],
    };


    const save = async () => {
        setIsActive(false);

        if (groupId && jwt && file) {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("title", filename)
            const {data, error} = await addNewDocumentInSubGroup(formData, groupId, jwt)
            if (data) {
                const doc : IDocument = data;
                notification.success({message: "ok"})
                setDoc(doc)

            }
            if (error) throw  error
        } else notification.error({message: "err"})
    };

    const handleCancel = () => {
        setIsActive(false);
    };

    const onCheckbox = (isOn : boolean) => {
        if (isOn && file) {
            const  name = file.name
            setFilename(name.substring(0, name.lastIndexOf(".")))
        } else {
           setFilename('')
        }
    }



    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const inputRef = useRef(null);

    const steps: TourProps['steps'] = [
        {
            title: 'Як завантажити файл',
            cover: (
                'Натисніть або перетягніть файл у виділену зону'
            ),
            target: () => ref1.current,
        },

        {
            title: "Назва файлу",
            description: 'Ви',
            target: () => ref2.current,
        },
        {
            title: "Ви можене не вписувати назву",
            target: () => ref2.current,
        },
    ];
        
    return (
        <>
            <Tour open={isTourActive} onClose={() => setIsAddDocTourActive(false)} steps={steps} />
            <Modal title={"Новий документ"} open={isActive} onOk={save} onCancel={handleCancel}>
                <Flex vertical gap={10}>
                    <Flex ref={inputRef} gap={10} vertical style={{width: "inherit"}}>
                        <span>Назва<span style={{color: "red"}}>*</span></span>
                        <Input style={{width: "inherit"}} value={filename} onChange={(e) => setFilename(e.target.value)}  type="text"/>
                        <div  ref={ref2}>
                            <Checkbox onChange={(e) => onCheckbox(e.target.checked)}>Взяти з назви файлу</Checkbox>
                        </div>
                    </Flex>
                    <Flex ref={ref1} gap={10} vertical style={{width: "100%"}}>
                        <Dragger style={{width: "inherit"}} {...props}>
                            <div style={{padding: "0 10px", width: "inherit"}}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Клікніть або перемістіть файл до цієї зони</p>
                                <p className="ant-upload-hint">
                                    Підтримка одиночного завантаження.
                                </p>
                            </div>

                        </Dragger>
                    </Flex>
                </Flex>
            </Modal>
        </>
    );
};

export default AddNewDocumentModal;