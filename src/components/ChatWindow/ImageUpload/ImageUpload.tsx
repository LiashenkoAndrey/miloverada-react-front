import React, {FC, MouseEventHandler, useRef} from 'react';
import {Flex, Image} from "antd";
import {CloseCircleOutlined, PlusOutlined} from "@ant-design/icons";

interface ImageUploadProps {
    isImageUploadActive : boolean
    imageList : string[],
    setFileList :  React.Dispatch<React.SetStateAction<string[]>>
    onImageUploadClose: MouseEventHandler<HTMLSpanElement>
}


const ImageUpload: FC<ImageUploadProps> = ({
                                               isImageUploadActive,
                                               imageList,
                                               setFileList,
                                               onImageUploadClose}) => {

    const inputFile = useRef<HTMLInputElement | null>(null)

    const getBase64 = (file : File, cb : Function) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    const onImageLoad = (file: FileList | null) => {
        if (file !== null) {
            getBase64(file[0], (res: string) => {
                setFileList([...imageList, res])
            })
        }
    }

    const onImageAdd = () => {
        inputFile.current?.click()
    }

    return (
        <div style={{
            display: isImageUploadActive ? "block" : "none",
            padding: "5px 10px",
            backgroundColor: "rgba(0,0,0,0.29)",
            position: "relative",
            borderTop: "solid rgba(0,0,0,0.40)"
        }}>
            <Flex gap={5}>
                {imageList.map( (img) =>
                    <Image key={"uploaded-" + img} style={{borderRadius: 5}} src={img} width={80} height={80}/>
                )}
                <input multiple onChange={(e) => onImageLoad(e.target.files)} style={{display: "none"}} ref={inputFile} type="file"/>
                <button onClick={onImageAdd} className={"addImg"} type="button">
                    <PlusOutlined/>
                    <div style={{marginTop: 8}}>Додати</div>
                </button>
            </Flex>
            <CloseCircleOutlined onClick={onImageUploadClose} style={{
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

export default ImageUpload;