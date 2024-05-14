import React, {FC, useContext, useEffect, useRef, useState} from 'react';
import {Button, Drawer, Flex, Image, Input, Modal, notification} from "antd";
import {useAuth0} from "@auth0/auth0-react";
import {updateAdminMeta} from "../../../API/services/UserService";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {AuthContext} from "../../../context/AuthContext";
import {useActions} from "../../../hooks/useActions";
import {
    getAllNotifications,
    getNotificationById,
    INotification,
    newNotification
} from "../../../API/services/NotificationService";
import Notification from "../Notification/Notification";
import {CloseOutlined, LeftOutlined, PlusOutlined} from "@ant-design/icons";
import useInput from "../../../API/hooks/useInput";
import HtmlEditor from "../../HtmlEditor";
import {Editor as TinyMCEEditor} from "tinymce";
import {checkPermission, toDateV2} from "../../../API/Util";

interface UserInfoDrawerProps {
    isUserDrawerActive: boolean
    setIsUserDrawerActive: React.Dispatch<React.SetStateAction<boolean>>
}

const UserInfoDrawer: FC<UserInfoDrawerProps> = ({setIsUserDrawerActive, isUserDrawerActive}) => {
    const {jwt} = useContext(AuthContext)
    const {setAdminMetadata, setNotificationNumber} = useActions()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const {user, logout} = useAuth0()
    const {adminMetadata, unreadNotificationNumber} = useTypedSelector(state => state.user)
    const [notifications, setNotifications] = useState<INotification[]>([])
    const [isNewNotificationModalActive, setIsNewNotificationModalActive] = useState<boolean>(false)

    useEffect(() => {
        if (isUserDrawerActive) {
            const getNotific = async () => {
                if (jwt && user?.sub) {
                    if (checkPermission(jwt, "admin")) {
                        const {data, error} = await getAllNotifications(encodeURIComponent(user.sub), jwt);
                        if (data) {
                            setNotifications(data)
                        }
                        if (error) {
                        }
                    } else console.log("DON'T HAS PERMISSION")
                } else {
                    console.error("not auth")
                }
            }
            getNotific()
        }
    }, [isUserDrawerActive]);


    const onLogout = () => {
        logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        })
    }

    const onClearMetadata = async () => {
        if (adminMetadata && jwt) {

            adminMetadata.isShowConfirmWhenDeleteDocument = true
            adminMetadata.isShowModalTourWhenUserOnDocumentsPage = true
            adminMetadata.isDocumentsPageTourCompleted = false
            setIsLoading(true)
            const {data, error} = await updateAdminMeta(adminMetadata, jwt)
            setIsLoading(false)

            if (data) {
                notification.success({message: "Метаданні успішно очищені"})
            }
            setAdminMetadata(adminMetadata)
            if (error) console.error(error);
        }
    }

    const [currentNotification, setCurrentNotification] = useState<INotification>()

    const onReadNotification = async (notification: INotification) => {
        if (notification.id && jwt && user?.sub && notification.isViewed !== undefined) {

            const {
                data,
                error
            } = await getNotificationById(notification.id, notification.isViewed, encodeURIComponent(user.sub), jwt);
            if (data) {
                setCurrentNotification(data)
                if (!notification.isViewed) {
                    const index = notifications.indexOf(notification);
                    notifications[index].isViewed = true;
                    const arr = new Array(...notifications)
                    setNotifications([...arr])
                    setNotificationNumber(Math.abs(unreadNotificationNumber - 1))
                }
            }
            if (error) console.error(error)
        } else console.error("id or jwt, isViewed are null", notification)
    }

    const onBackToProfile = () => {
        setCurrentNotification(undefined);
    }

    const onCloseDrawer = () => {
        setIsUserDrawerActive(false)
    }

    return (
        <Drawer
            size={currentNotification ? 'large' : 'default'}
            title={currentNotification ? currentNotification.message : "Мій профіль"}
            onClose={currentNotification ? onBackToProfile : onCloseDrawer}
            open={isUserDrawerActive}
            closeIcon={currentNotification ? <LeftOutlined/> : <CloseOutlined/>}
        >
            <Flex vertical
                  style={{height: "100%"}}
                  justify={"space-between"}
                  gap={40}
            >
                {!currentNotification &&
                    <Flex gap={10} vertical>

                        <Flex gap={10}>
                            <Image src={user?.picture}/>
                            <Flex vertical>
                                <span>{user?.name}</span>
                                <span>{user?.email}</span>
                            </Flex>
                        </Flex>
                        <Button onClick={onLogout}
                                style={{width: "fit-content"}}
                                type={"primary"}
                        >Вийти
                        </Button>

                        <Flex gap={8} vertical style={{margin: "10px 5px"}}>
                            {notifications.map((notif) =>
                                <Notification key={"notif-" + notif.id} notification={notif}
                                              onClick={onReadNotification}/>
                            )}
                        </Flex>
                    </Flex>
                }

                {currentNotification &&
                    <Flex vertical gap={10}>
                        {currentNotification.createdOn &&
                            <span style={{
                                color: "brown",
                                fontSize: 14,
                                fontWeight: 600
                            }}>{toDateV2(currentNotification.createdOn)}</span>
                        }
                        <p dangerouslySetInnerHTML={{__html: currentNotification.text}}></p>
                    </Flex>
                }

                {!currentNotification &&
                    <Flex vertical gap={5}>

                        {isUserDrawerActive &&
                            <NewNotificationModal setIsOpen={setIsNewNotificationModalActive}
                                                  isOpen={isNewNotificationModalActive}
                                                  notifications={notifications}
                                                  setNotifications={setNotifications}
                            />
                        }
                        {checkPermission(jwt, "admin") &&
                            <>
                                <Button style={{width: "fit-content"}}
                                        onClick={() => setIsNewNotificationModalActive(true)}
                                        icon={<PlusOutlined/>}>Повідомлення</Button>
                                <Button style={{width: "fit-content"}}
                                        onClick={onClearMetadata}
                                        loading={isLoading}
                                >Очистити метадані</Button>
                            </>
                        }
                        <Button disabled
                                style={{width: "fit-content"}}
                                danger
                        >Видалити профіль</Button>
                    </Flex>
                }
            </Flex>
        </Drawer>
    );
};

interface NewNotificationModalProps {
    isOpen: boolean
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    setNotifications: React.Dispatch<React.SetStateAction<INotification[]>>
    notifications: INotification[]
}

const NewNotificationModal: FC<NewNotificationModalProps> = ({
                                                                 isOpen,
                                                                 setIsOpen,
                                                                 setNotifications,
                                                                 notifications
                                                             }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [text, setText] = useState<string>()
    const {jwt} = useContext(AuthContext)
    const message = useInput()
    const editorRef = useRef<TinyMCEEditor | null>(null)

    const onSave = async () => {
        if (jwt && text && message.value) {
            console.log(message)
            console.log(text)
            setIsLoading(true)
            let notif: INotification = {
                text: text,
                message: message.value
            }
            console.log(notif)
            const {data, error} = await newNotification(notif, jwt)

            setIsLoading(false)
            if (data) {
                console.log(data)
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


export {UserInfoDrawer, NewNotificationModal};