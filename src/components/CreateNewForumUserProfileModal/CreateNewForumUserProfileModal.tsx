import React, {useContext, useEffect, useRef, useState} from 'react';
import {Button, Descriptions, Flex, Image, message, Modal, Typography} from "antd";
import {useAuth0} from "@auth0/auth0-react";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import TextareaAutosize from "react-textarea-autosize";
import textAreaClasses from "../NewsNewCommentInput/NewsNewCommentInput.module.css";
import {NewForumUserDto} from "../../API/services/forum/ForumInterfaces";
import {getBase64} from "../../API/Util";
import {saveNewForumUser} from "../../API/services/forum/UserService";
import {AuthContext} from "../../context/AuthContext";
import {setForumUser} from "../../store/actionCreators/user";
import {useActions} from "../../hooks/useActions";

const { Paragraph } = Typography;

const CreateNewForumUserProfileModal = () => {
    const [isOpen, setIsOpen] = useState<boolean>(true)
    const {user} = useAuth0()
    const [nickname, setNickname] = useState<string>()
    const {appUser} = useTypedSelector(state => state.user)
    const [aboutMe, setAboutMe] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [avatar, setAvatar] = useState<string>()
    const inputFile = useRef<HTMLInputElement | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const {jwt} = useContext(AuthContext)
    const {setForumUser} = useActions()


    useEffect(() => {
        if (appUser) {
            setNickname(appUser.firstName)
            setAvatar(appUser.avatarUrl)
        }
    }, [appUser]);

    const onSubmit = async () => {
        if (nickname && avatar && jwt && user?.sub && user.picture) {
            const formData : FormData = new FormData();
            formData.append("nickname", nickname)
            formData.append("avatar", avatar)
            formData.append("aboutMe", aboutMe)
            if (imageFile) {
                formData.append("avatarImageFile", imageFile)
            } else {
                formData.append("googleAvatar", user.picture)
            }

            setIsLoading(true)
            const {data, error} = await saveNewForumUser(formData, encodeURIComponent(user.sub), jwt)
            setIsLoading(false)

            if (data) {
                console.log("user saved!", data)
                setForumUser(data)
                setIsOpen(false)
            }
            if (error) {

                message.error("Виникла помилка, будь ласка спробуйте ще раз")
            }
        } else {
            console.log("vars", nickname, avatar, jwt, user?.sub)
            message.warning({content : "Некоректні дані"})
        }
    }

    const onImageLoad = (fileList: FileList | null) => {
        if (fileList !== null) {

            for (let i = 0; i < fileList.length; i++) {
                setImageFile(fileList[i])

                getBase64(fileList[i], (res: string) => {
                    console.log(res)
                    setAvatar(res)
                })
            }
        }
    }

    const onImageAdd = () => {
        inputFile.current?.click()
    }


    return (
        <Modal title={"Створення профілю"}
               destroyOnClose={true}
               okText={"Створити профіль"}
               open={isOpen}
               onCancel={() => setIsOpen(false)}
               onOk={onSubmit}
               okButtonProps={{loading : isLoading}}
        >
            <Flex vertical>
                <p>Щоб стати учасником форуму необхідно створити профіль щоб інші користувачі могли бачити вас</p>
                {user &&
                    <Flex gap={5} vertical>
                        <span style={{fontWeight: "bold"}}>Мій аватар</span>
                        <Flex gap={5}>

                            <div>
                                <Image height={200} src={avatar}/>

                            </div>
                            <input onChange={(e) => onImageLoad(e.target.files)}
                                   type="file"
                                   ref={inputFile}
                                   style={{display: "none"}}
                            />
                            <Button onClick={onImageAdd}>Змінити</Button>
                        </Flex>

                        <Descriptions title={"Публічна інформація"}>
                            <Descriptions.Item label="Ім'я/Псевдонім"><Paragraph  editable={{
                                onChange: setNickname,
                            }}>{nickname}</Paragraph> </Descriptions.Item>
                        </Descriptions>

                        <Flex>
                            <TextareaAutosize
                                className={textAreaClasses.textArea}
                                maxLength={3000}
                                placeholder={"Про мене..."}
                                value={aboutMe}
                                onChange={(e) => setAboutMe(e.target.value)}
                            />
                        </Flex>
                    </Flex>
                }
            </Flex>
        </Modal>
    );
};

export default CreateNewForumUserProfileModal;