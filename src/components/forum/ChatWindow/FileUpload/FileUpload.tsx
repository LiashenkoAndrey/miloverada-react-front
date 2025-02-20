import React, {FC, useRef} from 'react';
import {Flex} from "antd";
import {CloseCircleOutlined, CloseOutlined, PlusOutlined} from "@ant-design/icons";
import fileClasses from "./FileUpload.module.css"
import {useActions} from "../../../../hooks/useActions";
import {useTypedSelector} from "../../../../hooks/useTypedSelector";
interface FileUploadProps {
    isFileUploadActive : boolean
    setIsFileUploadActive : React.Dispatch<React.SetStateAction<boolean>>
}

const FileUpload: FC<FileUploadProps>= ({isFileUploadActive, setIsFileUploadActive}) => {
    const {setFilesList} = useActions()
    const {filesList} = useTypedSelector(state => state.chatInput)
    const fileInput = useRef<HTMLInputElement | null>(null)

    const onUploadCansel = () => {
        setIsFileUploadActive(false)
        setFilesList([])
    }


    const onFileAdd = () => {
        fileInput.current?.click()
    }

    const onFileLoad = (newFilesList: FileList | null) => {
        if (newFilesList !== null) {
            const list = [...filesList, ...Array.from(newFilesList) ]
            setFilesList(list)
            console.log(list)
        }
    }

    const onFileClick = (fileName : string) => {
        setFilesList(filesList.filter((file) => file.name !== fileName))
    }

    return (
        <div style={{
            display: isFileUploadActive ? "block" : "none",
            padding: "5px 10px",
            backgroundColor: "rgba(0,0,0,0.29)",
            position: "relative",
            borderTop: "solid rgba(0,0,0,0.40)"
        }}>
            <Flex gap={5}>
                <Flex gap={5} vertical>
                    {filesList.map((file) =>
                        <Flex onClick={() => onFileClick(file.name)} className={fileClasses.file} gap={5} key={file.name}>
                            <span>{file.name}</span>
                            <CloseOutlined className={fileClasses.removeFileBtn} style={{fontSize: 15}} />
                        </Flex>
                    )}
                </Flex>

                <input multiple onChange={(e) => onFileLoad(e.target.files)} style={{display: "none"}} ref={fileInput}
                       type="file"/>
                <button onClick={onFileAdd} className={"addImg"} type="button">
                    <PlusOutlined/>
                    <div style={{marginTop: 8}}>Додати файл</div>
                </button>
            </Flex>
            <CloseCircleOutlined onClick={onUploadCansel} style={{
                position: "absolute",
                right: 10,
                top: 10,
                fontSize: 20,
                color: "white",
                cursor: "pointer"
            }}/>
        </div>
    );
};

export default FileUpload;