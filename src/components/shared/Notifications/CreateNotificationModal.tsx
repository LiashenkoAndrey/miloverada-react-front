import React, {FC, useContext, useRef, useState} from 'react';
import {AuthContext} from "../../../context/AuthContext";
import {useAuth0} from "@auth0/auth0-react";
import useInput from "../../../API/hooks/useInput";
import {Editor as TinyMCEEditor} from "tinymce";
import {INewNotification, INotification, newNotification} from "../../../API/services/main/NotificationService";
import {Flex, Input, Modal, notification} from "antd";
import HtmlEditor from "../HtmlEditor";

interface NewNotificationModalProps {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    setNotifications: React.Dispatch<React.SetStateAction<INotification[]>>
    notifications: INotification[]
}


const CreateNotificationModal: FC<NewNotificationModalProps> = ({
                                                                     isOpen,
                                                                     setIsOpen,
                                                                     setNotifications,
                                                                     notifications
                                                                 }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [text, setText] = useState<string>()
    const {jwt} = useContext(AuthContext)
    const {user} = useAuth0()
    const message = useInput()
    const editorRef = useRef<TinyMCEEditor | null>(null)

    const onSave = async () => {
        if (jwt && user?.sub && text && message.value) {
            setIsLoading(true)
            let notif: INewNotification = {
                text: text,
                message: message.value,
                authorId: user.sub
            }
            const {data, error} = await newNotification(notif, jwt)

            setIsLoading(false)
            if (data) {
                data.isViewed = false;
                setNotifications([data, ...notifications])
                notification.success({message: "Сповіщення збережено успішно!"})
                setIsOpen(false)
                setText('')
                message.setValue("")
            }
            if (error) {
                notification.error({message: "Виникла помилка :( Спробуйте ще раз!"})
            }
        } else {
            notification.warning({message: "Не авторизована дія!"})
        }
    }

    return (
        <Modal open={isOpen}
               okButtonProps={{loading: isLoading ? isLoading : false}}
               onOk={onSave}
               width={"50vw"}
               onCancel={() => setIsOpen(false)}
        >
            <Flex vertical gap={5} style={{marginTop: 30}}>
                <Input {...message} placeholder={"Повідомлення"}/>
                <HtmlEditor val={text} onInit={(evt, editor) => {
                    editorRef.current = editor
                }}
                            onChange={(str) => {
                                setText(str)
                            }}
                />
            </Flex>
        </Modal>
    );
};

export default CreateNotificationModal;