import React, {FC, useContext, useState} from 'react';
import {Button, Drawer, Flex, Image, notification} from "antd";
import {useAuth0} from "@auth0/auth0-react";
import {updateAdminMeta} from "../../../API/services/UserService";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {AuthContext} from "../../../context/AuthContext";
import {useActions} from "../../../hooks/useActions";

interface UserInfoDrawerProps {
    isUserDrawerActive : boolean
    setIsUserDrawerActive: React.Dispatch<React.SetStateAction<boolean>>
}

const UserInfoDrawer: FC<UserInfoDrawerProps> = ({setIsUserDrawerActive, isUserDrawerActive}) => {
    const {jwt} = useContext(AuthContext)
    const {setAdminMetadata} = useActions()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const {user, logout} = useAuth0()
    const {adminMetadata} = useTypedSelector(state => state.user)

    const onLogout = () => {
        logout({
            logoutParams : {
                returnTo : window.location.origin
            }
        })
    }

    const onClearMetadata = async () => {
        if (adminMetadata && jwt) {

            adminMetadata.isShowConfirmWhenDeleteDocument = true
            adminMetadata.isShowModalTourWhenUserOnDocumentsPage = true
            adminMetadata.isDocumentsPageTourCompleted = false
            setIsLoading(true)
            const {data, error} = await updateAdminMeta(adminMetadata,  jwt)
            setIsLoading(false)

            if (data) {
                notification.success({message: "Метаданні успішно очищені"})
            }
            setAdminMetadata(adminMetadata)
            if (error) console.error(error);
        }
    }

    return (
        <Drawer title="Мій профіль"
                onClose={() => setIsUserDrawerActive(false)}
                open={isUserDrawerActive}
        >
            <Flex vertical
                  style={{height: "100%"}}
                  justify={"space-between"}
                  gap={40}
            >

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
                    >Вийти</Button>
                </Flex>



                <Flex vertical gap={5} >
                    <Button style={{width: "fit-content"}}
                            onClick={onClearMetadata}
                            loading={isLoading}
                    >Очистити метадані</Button>
                    <Button disabled
                            style={{width: "fit-content"}}
                            danger
                    >Видалити профіль</Button>
                </Flex>
            </Flex>
        </Drawer>
    );
};

export default UserInfoDrawer;