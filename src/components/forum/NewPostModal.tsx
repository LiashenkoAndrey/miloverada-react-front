import React, {FC, useContext, useRef, useState} from 'react';
import {Button, Flex, Image, Modal, notification} from "antd";
import classes from "../../pages/AddNewsPage/AddNewsPage.module.css";
import classes2 from '../../pages/AddNewsPage/NewsImage/NewsImage.module.css'
import textAreaClasses from '../../components/NewsNewCommentInput/NewsNewCommentInput.module.css'
// @ts-ignore
import imagePlaceholder from "../../assets/image-placeholder.svg";
import {CloseCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {IImage} from "../../domain/NewsInt";
import {getBase64} from "../../API/Util";
import TextareaAutosize from "react-textarea-autosize";
import {newTopic} from "../../API/services/forum/StoryService";
import {AuthContext} from "../../context/AuthContext";
import {useAuth0} from "@auth0/auth0-react";
import {IPost, newPost} from "../../API/services/forum/PostService";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {useActions} from "../../hooks/useActions";

interface NewStoryModalProps {
    isOpen : boolean
    setIsOpen :  React.Dispatch<React.SetStateAction<boolean>>

}

const NewStoryModal:FC<NewStoryModalProps> = ({isOpen, setIsOpen}) => {
    const [text, setText] = useState<string>('')
    const [imagesFiles, setImagesFiles] = useState<File[]>([])
    const [newsImages, setNewsImages] = useState<IImage[]>([])
    const inputFile = useRef<HTMLInputElement | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const {jwt} = useContext(AuthContext)
    const {user} = useAuth0()
    const {posts} = useTypedSelector(state => state.forum)
    const {setPosts} = useActions()

    const handleOk = async () => {
        if (jwt && user?.sub) {
            setIsLoading(true)
            const form = new FormData()
            form.append("image", imagesFiles[0])
            form.append('text', text)
            const {data, error} = await newPost(form, encodeURIComponent(user.sub), jwt)
            setIsLoading(false)

            if (data) {
                console.log(data)
                setPosts([...posts, data])
                setIsOpen(false)
            }
            if (error) throw error
        } else notification.warning({message : "not auth"})
    };

    const handleCancel = () => {
        setIsOpen(false)

    };

    const onImageAdd = () => {
        inputFile.current?.click()
    }


    const onImageLoad = (fileList: FileList | null) => {
        if (fileList !== null) {
            const  arr : IImage[] = []
            for (let i = 0; i < fileList.length; i++) {
                setImagesFiles([...imagesFiles, fileList[i]])

                getBase64(fileList[i], (res: string, filename : string) => {
                    const img : IImage = {
                        base64Image : res,
                        fileName : filename
                    }
                    arr.push(img)
                    if (i === fileList.length-1) {
                        setNewsImages([...newsImages, ...arr])
                    }
                })
            }
        }
    }
    const onRemove = (img: IImage) => {
        setNewsImages(newsImages.filter((e) => e.base64Image !== img.base64Image))
        setImagesFiles(imagesFiles.filter((file) => file.name !== img.fileName))
    }


    return (
        <Modal title="Новий пост"
               open={isOpen}
               confirmLoading={isLoading}
               onOk={handleOk}
               onCancel={handleCancel}
               okText={"Додати"}
        >
            <input multiple
                   onChange={(e) => onImageLoad(e.target.files)}
                   style={{display: "none"}}
                   ref={inputFile}
                   type="file"
            />

            <Flex wrap={"wrap"}
                  className={[classes.imagesWrapper, classes.primaryBg].join(' ')}
                  gap={15}
            >
                <Flex align={"center"}
                      gap={5} wrap={"wrap"}
                      justify={"center"}
                      style={{flexGrow: 1}}
                >
                    {imagesFiles.length > 0 ?
                        newsImages.map((img) =>
                            <div style={{position: "relative"}} className={classes2.imgWrapper}>
                                <Image className={classes2.image}
                                       src={img.base64Image}
                                       alt="imagePlaceholder"
                                />
                                <CloseCircleOutlined onClick={() => onRemove(img)}
                                                     className={classes2.removeImgIcon}
                                                     style={{position: "absolute", right: 0, top: 0, fontSize: 25}}
                                />
                            </div>
                        )
                        :
                        <img className={classes.imagePlaceholder}
                             src={imagePlaceholder} alt="imagePlaceholder"
                        />
                    }
                </Flex>

                <Flex vertical gap={5}>
                    <span className={classes.inputTitle}>Фото</span>
                    <Button icon={<PlusOutlined/>} onClick={onImageAdd}>
                        Додати
                    </Button>
                </Flex>
            </Flex>

            <TextareaAutosize
                id={"commentTextArea"}
                className={textAreaClasses.textArea}
                maxLength={3000}
                placeholder={"Текст..."}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </Modal>
    );
};

export default NewStoryModal;