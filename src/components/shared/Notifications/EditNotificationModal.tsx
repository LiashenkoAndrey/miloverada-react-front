import React, {FC, useContext, useEffect, useRef, useState} from 'react';
import {editNotification, IEditNotification, INotification} from "../../../API/services/main/NotificationService";
import {AuthContext} from "../../../context/AuthContext";
import {useAuth0} from "@auth0/auth0-react";
import useInput from "../../../API/hooks/useInput";
import {Editor as TinyMCEEditor} from "tinymce";
import {Flex, Input, Modal, notification} from "antd";
import HtmlEditor from "../HtmlEditor";

interface EditNotificationModalProps {
    notificationToEdit: INotification
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    setNotifications: React.Dispatch<React.SetStateAction<INotification[]>>
    notifications: INotification[]
    setCurrentNotification: React.Dispatch<React.SetStateAction<INotification | null>>
}

const EditNotificationModal: FC<EditNotificationModalProps> = ({
                                                                   setIsOpen,
                                                                   notificationToEdit,
                                                                   isOpen,
                                                                   setNotifications,
                                                                   notifications
                                                                   ,
                                                                   setCurrentNotification

                                                               }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [text, setText] = useState<string>()
    const {jwt} = useContext(AuthContext)
    const {user} = useAuth0()
    const message = useInput()
    const editorRef = useRef<TinyMCEEditor | null>(null)

    useEffect(() => {
        if (notificationToEdit) {
            setText(notificationToEdit.text)
            message.setValue(notificationToEdit.message)

        }
    }, [notificationToEdit]);

    const onSave = async () => {
        if (jwt && user?.sub && text && message.value) {
            setIsLoading(true)
            let notif: IEditNotification = {
                text: text,
                message: message.value,
            }
            const {data, error} = await editNotification(notif, notificationToEdit.id, jwt)

            setIsLoading(false)
            if (data) {
                notification.success({message: "Сповіщення оновлено успішно!"})
                setIsOpen(false)
                setText('')

                message.setValue("")
                console.log(notifications, notificationToEdit, notifications.indexOf(notificationToEdit))
                let old = notifications.find((e) => e.id === notificationToEdit.id)
                if (old) {

                    old.message = message.value
                    old.text = text
                    setNotifications(notifications)
                    setCurrentNotification(old)
                } else console.log("Notific not found", notificationToEdit)
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
               title={"Редагування повідомлення №" + notificationToEdit.id}
               onOk={onSave}
               okText={"Оновити"}
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

export default EditNotificationModal;