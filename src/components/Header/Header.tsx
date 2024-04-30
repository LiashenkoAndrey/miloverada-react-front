import React, {useContext, useEffect, useState} from 'react';
import classes from './Header.module.css'
import {Button, Drawer, Dropdown, Flex, Image, MenuProps, notification, Skeleton, Space, Tooltip} from "antd";
// @ts-ignore
import icon from '../../assets/icon.png'
import {useLocation, useNavigate} from "react-router-dom";
import MobileNav from "./MobileNav";
import {MenuOutlined, UserOutlined} from "@ant-design/icons";
import {useAuth0} from "@auth0/auth0-react";
import {AuthContext} from "../../context/AuthContext";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {getUserById, updateAdminMeta} from "../../API/services/UserService";
import {AppUser} from "../../API/services/forum/ForumInterfaces";
import {useActions} from "../../hooks/useActions";
import {setUser} from "../../store/actionCreators/user";

export interface HeaderOption {
    onClick : () => void
    title : any
}

const Header = () => {
    const nav  = useNavigate()
    const { pathname } = useLocation();
    const {loginWithRedirect, isAuthenticated, user, logout } = useAuth0()
    const {jwt} = useContext(AuthContext)
    const {appUser, adminMetadata} = useTypedSelector(state => state.user)
    const {setUser} = useActions()
    const {setAdminMetadata} = useActions()

    useEffect( () => {
        const getUser =  async (id : string, jwt : string) => {
            const {data} = await getUserById(encodeURI(id), jwt)
            console.log(data)
            const gotUser : AppUser = data
            setUser(gotUser)
        }
        if (jwt) {
            console.log("is auth jwt")
            if (appUser === undefined) {
                if (user?.sub) {
                    console.log(user.sub)
                    getUser(user.sub, jwt)
                }
            }
            console.log(user)
        }
    }, [jwt]);

    const options : HeaderOption[] = [
        {onClick : () => nav("/documents/all"), title : "Документи"},
        {onClick : () => nav("/newsFeed/all"), title : "Новини"},
        {onClick : () => {

            }, title : <Tooltip title={"Незабаром буде доступно :)"}>Форум</Tooltip>},
        {onClick : () => nav("/"), title : "Управління"},
        {onClick : () => nav("/institutions"), title : "Установи"},
        {onClick : () => nav("/contacts"), title : "Контакти"},
    ]
    const onLogin = async () => {
        await loginWithRedirect({
            appState: {
                returnTo : "resolveUser?redirectTo="+ window.location.pathname
            },
            authorizationParams: {
                prompt: "login",
            },
        })
    }
    const onLogout = () => {
        logout({
            logoutParams : {
                returnTo : window.location.origin
            }
        })
    }

    const userIcon =
        isAuthenticated
            ?
            <Flex onClick={() => setIsUserDrawerActive(true)}
                  align={"center"}
                  vertical
                  className={classes.headNavItem}
                  style={{ background: "none"}}
            >
                <img src={user?.picture} height={30} alt=""/>
                <span style={{color: "white"}}>{user?.firstName}</span>
                {/*<Button ghost danger onClick={onLogout} >Вийти</Button>*/}
            </Flex>
            :
            <Flex align={"center"} onClick={onLogin} gap={10} className={classes.headNavItem} style={{paddingLeft: 10}}>
                <UserOutlined style={{fontSize: 18, padding: 0, color: "white"}} />
                <span className={classes.btnText} >Вхід</span>
            </Flex>


    let items = () : MenuProps['items'] => {
        let arr = options.map((o) => {
            return {
                label:  <span className={[classes.headNavItem, classes.btnText].join(' ')} style={{fontSize: 20}} onClick={o.onClick}>{o.title}</span>,
                key: 'nav-elem-' + o.title,
            }
        })
        arr.push({label: (
            <>
                {userIcon}
            </>
            ), key: 'nav-elem-user'})
        return arr;
    }

    const [isLoading, setIsLoading] = useState<boolean>(false)

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

    const [isUserDrawerActive, setIsUserDrawerActive] = useState<boolean>(false)

    if ( pathname.includes("forum")) {
        return (
            <>
            </>
        )
    }



    return (
        <Flex justify={"center"}
              className={classes.navbar}
              style={{
                  display: pathname.includes("chat") ||
                           pathname.includes("news/new") ? "none" : "block"
                }}
        >
            <Flex className={"IContainer"}
                  justify={"space-between"}
                  align={"center"}
            >
                <Flex onClick={() => nav("/")}
                      className={"nonSelect"}
                >
                    <span className={classes.title}>Милівська сільська територіальна громада</span>
                    <img className={classes.logo} src={icon} width={50} alt={"Герб України"}/>
                </Flex>

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


                <Flex wrap={"wrap"}
                      justify={"center"}
                      className={[classes.navBtnWrapper, "nonSelect"].join(' ')}
                >
                    {options.map((o) =>
                        <span className={[classes.headNavItem, classes.btnText].join(' ')}
                              key={"Head-option-" + o.title}
                              onClick={o.onClick}
                        >{o.title}</span>
                    )}
                    {userIcon}
                </Flex>


                <Flex wrap={"wrap"}
                      justify={"center"}
                      className={[classes.mobileNavBtnWrapper, "nonSelect"].join(' ')}
                >
                    <Dropdown menu={{items: items()}}
                              trigger={['click']}
                    >
                        <Space>
                            <MenuOutlined className={classes.menu} style={{ fontSize: 30}} />
                        </Space>
                    </Dropdown>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Header;