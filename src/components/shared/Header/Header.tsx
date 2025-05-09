import React, {useContext, useEffect} from 'react';
import classes from './Header.module.css'
import {Dropdown, Flex, MenuProps, Space, Tooltip} from "antd";
// @ts-ignore
import icon from '../../../assets/icon.png'
import {useLocation, useNavigate} from "react-router-dom";
import {MenuOutlined, UserOutlined} from "@ant-design/icons";
import {useAuth0} from "@auth0/auth0-react";
import {AuthContext} from "../../../context/AuthContext";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {getUserById} from "../../../API/services/main/UserService";
import {AppUser} from "../../../API/services/forum/ForumInterfaces";
import {useActions} from "../../../hooks/useActions";
import {getTotalNumberOfNotifications} from "../../../API/services/main/NotificationService";
import UserIcon from "./UserIcon";

export interface HeaderOption {
    onClick : () => void
    title : any
}

const Header = () => {

    const nav  = useNavigate()
    const {pathname} = useLocation();
    const {loginWithRedirect, isAuthenticated, user} = useAuth0()
    const {jwt} = useContext(AuthContext)
    const {appUser} = useTypedSelector(state => state.user)
    const {setUser, setNotificationNumber} = useActions()

    useEffect(() => {
        const getNotificationsNumber = async () => {
            if (jwt && user?.sub) {
                const {data, error} = await getTotalNumberOfNotifications(encodeURIComponent(user?.sub),jwt)
                if (data) {
                    console.log(data)
                    setNotificationNumber(data)
                }
                if (error) console.log("error when load notifications")
            }
        }
        getNotificationsNumber();
    }, [jwt]);

    useEffect( () => {
        const getUser =  async (id : string, jwt : string) => {
            const {data} = await getUserById(encodeURI(id), jwt)
            const gotUser : AppUser = data
            setUser(gotUser)
        }
        if (jwt) {
            if (appUser === undefined) {
                if (user?.sub) {
                    getUser(user.sub, jwt)
                }
            }
        }
    }, [jwt]);

    const options : HeaderOption[] = [
        {onClick : () => nav("/application"), title : "Звернення"},
        {onClick : () => nav("/documents/all"), title : "Документи"},
        {onClick : () => nav("/newsFeed/all"), title : "Новини"},
        {onClick : () => {

            }, title :
                    <Tooltip title={"Ведуться технічні роботи..."}>
                        Форум
                    </Tooltip>
        },
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

    const userIcon =
        isAuthenticated
            ?
            <UserIcon/>
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

    if (pathname.includes("forum") || pathname.includes("manage-panel")) {
        return (<></>)
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
                  gap={5}
            >
                <Flex onClick={() => nav("/")}
                      className={"nonSelect"}
                >
                    <span className={classes.title}>Милівська сільська територіальна громада</span>
                    <img className={classes.logo} src={icon} width={50} alt={"Герб України"}/>
                </Flex>

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
                    <Dropdown menu={{items: items(),  className: classes.menuItems}}

                              getPopupContainer={(triggerNode) => {
                                  triggerNode.classList.add(classes.dropdown)
                                  return triggerNode;
                              }}
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
