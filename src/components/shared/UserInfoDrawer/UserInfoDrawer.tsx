import React, {FC, useContext, useEffect, useState} from 'react';
import {Button, Drawer, Flex, Image, message, notification, Popconfirm} from "antd";
import {useAuth0} from "@auth0/auth0-react";
import {updateAdminMeta} from "../../../API/services/main/UserService";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {AuthContext} from "../../../context/AuthContext";
import {useActions} from "../../../hooks/useActions";
import {
  deleteNotificationById,
  getAllNotifications,
  getNotificationById,
  INotification
} from "../../../API/services/main/NotificationService";
import Notification from "../Notifications/Notification/Notification";
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  LeftOutlined,
  PlusOutlined
} from "@ant-design/icons";
import {checkPermission, formatDateTodayOrYesterday, toDateV2} from "../../../API/Util";
import CreateNotificationModal from "../Notifications/CreateNotificationModal";
import EditNotificationModal from "../Notifications/EditNotificationModal";
import {useNavigate} from "react-router-dom";

interface UserInfoDrawerProps {
  isUserDrawerActive: boolean
  setIsUserDrawerActive: React.Dispatch<React.SetStateAction<boolean>>
}

const UserInfoDrawer: FC<UserInfoDrawerProps> = ({setIsUserDrawerActive, isUserDrawerActive}) => {
  const {jwt} = useContext(AuthContext)
  const {setAdminMetadata, setNotificationNumber} = useActions()
  const nav = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {user, isAuthenticated, logout} = useAuth0()
  const {adminMetadata, unreadNotificationNumber} = useTypedSelector(state => state.user)
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [isNewNotificationModalActive, setIsNewNotificationModalActive] = useState<boolean>(false)

  useEffect(() => {
    if (isUserDrawerActive) {
      const getNotifications = async () => {
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
      getNotifications()
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

  const [currentNotification, setCurrentNotification] = useState<INotification | null>(null)

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
    setCurrentNotification(null);
  }

  const onCloseDrawer = () => {
    console.log("onCloseDrawer")
    setIsUserDrawerActive(false)
  }

  const [isEditNotificationModalOpen, setIsEditNotificationModalOpen] = useState<boolean>(false)

  const onClickEditNotification = () => {
    setIsEditNotificationModalOpen(true)
  }

  const [isDeleteNotificationLoading, setIsDeleteNotificationLoading] = useState<boolean>(false)

  const onDeleteNotification = async () => {
    if (jwt && currentNotification) {
      setIsDeleteNotificationLoading(true)
      const {data, error} = await deleteNotificationById(currentNotification.id, jwt)
      setIsDeleteNotificationLoading(false)
      if (data) {
        message.success({content: "Видалено успішно", duration: 1})
        setNotifications(notifications.filter((e) => e.id !== currentNotification.id))
        onBackToProfile()
      }
      if (error) {
        notification.error({message: "Виникла помилка :( Спробуйте ще раз!"})
      }
    }
  }

  const onUserStartChatWithAuthorButtonClick = () => {
    if (isAuthenticated && currentNotification) {
      nav("/forum/user/" + currentNotification.author.id + "/chat")
    } else console.log("user sub null")
  }

  return (
      <Drawer
          size={currentNotification ? 'large' : 'default'}
          title={currentNotification ? <Flex justify={"space-between"} gap={10} align={"center"}>
            <span style={{fontSize: 20}}>{currentNotification.message}</span>

            <Flex>
              <Button icon={<EditOutlined/>} onClick={onClickEditNotification}>
                Редагувати
              </Button>

              <Popconfirm
                  title="Видалити"
                  description="Ви впевнені? Дія незворотня."
                  onConfirm={onDeleteNotification}
                  okButtonProps={{loading: isDeleteNotificationLoading}}
              >
                <Button loading={isDeleteNotificationLoading}
                        icon={<DeleteOutlined/>}>
                  {isDeleteNotificationLoading ? "Видалення..." : "Видалити"}
                </Button>
              </Popconfirm>
            </Flex>
          </Flex> : "Мій профіль"}
          onClose={currentNotification ? onBackToProfile : onCloseDrawer}
          open={isUserDrawerActive}
          closeIcon={currentNotification ? <LeftOutlined/> : <CloseOutlined/>}
      >
        <Flex vertical
              style={{height: "100%"}}
              justify={"space-between"}
              gap={40}
        >

          {(isEditNotificationModalOpen && currentNotification) &&
              <EditNotificationModal notificationToEdit={currentNotification}
                                     setCurrentNotification={setCurrentNotification}
                                     notifications={notifications}
                                     setNotifications={setNotifications}
                                     isOpen={isEditNotificationModalOpen}
                                     setIsOpen={setIsEditNotificationModalOpen}
              />
          }

          {!currentNotification &&
              <Flex gap={10} vertical>
                    <Button disabled type={"primary"} onClick={() => nav("/manage-panel")}>
                        Панель керування
                    </Button>
                <Flex gap={10} style={{marginTop: 10}}>
                  <Image src={user?.picture}/>
                  <Flex vertical justify={"space-between"}>
                    <Flex vertical>
                      <span>{user?.name}</span>
                      <span>{user?.email}</span>
                    </Flex>

                    <Button onClick={onLogout}
                            style={{width: "fit-content"}}
                            type={"primary"}
                    >
                      Вийти
                    </Button>
                  </Flex>
                </Flex>

                <span style={{color: "black", fontSize: 20, paddingTop: 5}}>Сповіщення</span>

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
                <Flex align={"center"} justify={"space-between"}>
                  {currentNotification.createdOn &&
                      <span style={{
                        color: "brown",
                        fontSize: 18,
                        fontWeight: 600
                      }}>{toDateV2(currentNotification.createdOn)} {formatDateTodayOrYesterday(currentNotification.createdOn)}</span>
                  }
                  <Button onClick={onUserStartChatWithAuthorButtonClick} icon={
                    <img
                        src={currentNotification.author.avatarBase64Image ? currentNotification.author.avatarBase64Image : currentNotification.author.avatarUrl}
                        alt="автор"
                        height={25}
                        width={25}
                        style={{borderRadius: 10}}
                    />
                  }>Написати автору</Button>
                </Flex>
                <p dangerouslySetInnerHTML={{__html: currentNotification.text}}></p>
              </Flex>
          }

          {!currentNotification &&
              <Flex vertical gap={5}>

                {isUserDrawerActive &&
                    <CreateNotificationModal setIsOpen={setIsNewNotificationModalActive}
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


export default UserInfoDrawer;