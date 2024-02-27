import React, {useContext, useEffect} from 'react';
import classes from './Header.module.css'
import {Dropdown, Flex, MenuProps, Skeleton, Space} from "antd";
// @ts-ignore
import icon from '../../assets/icon.png'
import {useLocation, useNavigate} from "react-router-dom";
import MobileNav from "./MobileNav";
import {MenuOutlined, UserOutlined} from "@ant-design/icons";
import {useAuth0} from "@auth0/auth0-react";
import {AuthContext} from "../../context/AuthContext";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {getUserById} from "../../API/services/UserService";
import {AppUser} from "../../API/services/forum/ForumInterfaces";
import {useActions} from "../../hooks/useActions";
import {setUser} from "../../store/actionCreators/user";

export interface HeaderOption {
    onClick : () => void
    title : string
}

const Header = () => {
    const nav  = useNavigate()
    const { pathname } = useLocation();
    const {loginWithRedirect, isAuthenticated, user } = useAuth0()
    const {jwt} = useContext(AuthContext)
    const {appUser} = useTypedSelector(state => state.user)
    const {setUser} = useActions()

    useEffect(() => {
        console.log(isAuthenticated)
    }, [isAuthenticated]);

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
        {onClick : () => nav("/forum"), title : "Форум"},
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

    const userIcon =
        appUser
            ?
            <Flex align={"center"} vertical className={classes.headNavItem} style={{padding: "5px 5px 0 5px"}}>
                <img src={appUser.avatarUrl} height={30} alt=""/>
                <span style={{color: "white"}}>{appUser.firstName}</span>
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



    return (
        <Flex justify={"center"} className={classes.navbar} style={{display: pathname.includes("chat") || pathname.includes("news/new") ? "none" : "block"}} >
            <Flex className={"IContainer"} justify={"space-between"} align={"center"} >
                <Flex onClick={() => nav("/")} className={"nonSelect"}>
                    <span className={classes.title}>Милівська сільська територіальна громада</span>
                    <img className={classes.logo} src={icon} width={50} alt={"Герб України"}/>
                </Flex>

                {/*{appUser &&*/}
                {/*    <Flex>*/}
                {/*        <img src={appUser.avatarBase64Image} height={50} alt=""/>*/}
                {/*        <img src={appUser.avatarUrl} height={50} alt=""/>*/}
                {/*        <span>{appUser.firstName}</span>*/}
                {/*        <span>{appUser.email}</span>*/}
                {/*        <span>{appUser.firstName}</span>*/}
                {/*        <span>{appUser.lastName}</span>*/}
                {/*        <span>{appUser.id}</span>*/}
                {/*    </Flex>*/}
                {/*}*/}



                <Flex wrap={"wrap"} justify={"center"} className={[classes.navBtnWrapper, "nonSelect"].join(' ')}>
                    {options.map((o) =>
                        <span className={[classes.headNavItem, classes.btnText].join(' ')}  key={"Head-option-" + o.title} onClick={o.onClick}>{o.title}</span>
                    )}
                    {userIcon}
                </Flex>


                <Flex wrap={"wrap"} justify={"center"} className={[classes.mobileNavBtnWrapper, "nonSelect"].join(' ')}>
                    <Dropdown menu={{items: items()}} trigger={['click']}>
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