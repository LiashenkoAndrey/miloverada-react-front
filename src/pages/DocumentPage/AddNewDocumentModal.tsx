import React, {FC, useContext, useEffect, useRef, useState} from 'react';
import {Checkbox, Flex, Input, InputRef, Modal, notification, Tour, TourProps, UploadProps} from "antd";
import Dragger from "antd/es/upload/Dragger";
import {InboxOutlined} from "@ant-design/icons";
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
    const [isCheckboxChecked, setIsCheckboxChecked] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const inputRefReal = useRef<InputRef>(null);

    const onChangeCheckbox = (e : any) => {
        if  (!isCheckboxChecked) {
            console.log("fill")
            fillFileTitleFromFilename()
        }
        setIsCheckboxChecked(!isCheckboxChecked)
    }

    useEffect(() => {
        console.log(inputRefReal.current)
        if (inputRefReal.current) {
            console.log(inputRefReal.current.input)
            if (inputRefReal.current.input) {
                console.log("present")
                console.log(inputRefReal.current.input)
                inputRefReal.current.input.focus()
            }
        }
    }, [inputRefReal.current]);

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

        if (groupId && jwt && file) {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("title", filename)
            setIsLoading(true)
            const {data, error} = await addNewDocumentInSubGroup(formData, groupId, jwt)
            setIsLoading(false)
            if (data) {
                const doc : IDocument = data;
                notification.success({message: "Документ " + filename + " успішно додано"})
                setDoc(doc)
                clearDocData()
                setIsActive(false);

            }
            if (error) {
                notification.error({message:
                        <Flex vertical gap={5}>
                        <span>Виникла помилка при додаванні документу :(</span>
                        <span>Спробуйте ще раз</span>
                    </Flex>})
                console.error(error)
            }
        } else notification.error({message: "Виникла помилка при додаванні :("})
    };

    /**
     * deletes inserted data of document
     */
    function clearDocData() {
        setFile(undefined)
        setFilename('')
    }

    const handleCancel = () => {
        setIsActive(false);
        setIsCheckboxChecked(false)
    };

    const fillFileTitleFromFilename = () => {
        if (file) {
            const  name = file.name
            setFilename(name.substring(0, name.lastIndexOf(".")))
        } else {
           setFilename('')
        }
    }



    const modalRef = useRef(null);
    const ref1 = useRef(null);
    const checkboxRef = useRef(null);
    const inputRef = useRef(null);

    const steps: TourProps['steps'] = [
        {
            title: 'Як додати новий документ',
            target: () => modalRef.current,
        },
        {
            title: 'Як завантажити файл',
            description : (
                <p>
                    Щоб завантажити файл натисніть на це поле або перетягніть файл
                </p>
            ),
            target: () => ref1.current,
        },
        {
            title: "Назва файлу",
            description: (
                <p>Тут ви вписуєте назву файла, намагайтеся уникати довгих назв, до 195 символів</p>
            ),
            target: () => inputRef.current,
        },
        {
            title: "Чи можна просто взяти назву з файлу",
            description: (
                <p>
                    Коли файл буде завантажено ви можете не списувати назву вручну а витягнути його з файлу поставивши цю галочку
                </p>
            ),
            target: () => checkboxRef.current,
            nextButtonProps: {
                onClick: () => {
                    setIsActive(false)
                }
            }
        },


    ];



    return (
        <>
            <Tour open={isTourActive} onClose={() => setIsAddDocTourActive(false)} steps={steps} />
            <Modal modalRender={(modal) =>
                <div ref={modalRef}>
                    {modal}
                </div>
            } title={"Новий документ"}
                   open={isActive}
                   onOk={save}
                   onCancel={handleCancel}
                   okButtonProps={{loading: isLoading}}

            >
                <Flex  vertical gap={10}>
                    <Flex gap={10} vertical style={{width: "inherit"}}>
                        <span>Назва<span style={{color: "red"}}>*</span></span>
                        <div ref={inputRef} style={{width: "100%"}}>
                            <Input ref={inputRefReal} autoFocus showCount  style={{width: "inherit"}} value={filename} onChange={(e) => setFilename(e.target.value)}  type="text"/>
                        </div>
                        <div  ref={checkboxRef}>
                            <Checkbox checked={isCheckboxChecked} onChange={onChangeCheckbox}>Взяти з назви файлу</Checkbox>
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