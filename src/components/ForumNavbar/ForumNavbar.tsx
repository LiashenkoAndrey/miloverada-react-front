import React, {FC, useEffect} from 'react';
import {Button, Flex, Image} from "antd";
import {
    HomeOutlined,
    LoginOutlined,
    QuestionCircleOutlined,
    SettingOutlined,
    TagsOutlined,
    UserOutlined
} from "@ant-design/icons";
import {useAuth0} from "@auth0/auth0-react";
import './ForumNavbar.css'
import {useNavigate} from "react-router-dom";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import ForumUserSettings from "../ForumUserSettings/ForumUserSettings";
import {getImageV2Url} from "../../API/services/ImageService";
interface ForumNavbarProps {
    children?: React.ReactNode;
}

const ForumNavbar : FC<ForumNavbarProps> = (props) => {
    const {isAuthenticated, loginWithRedirect, user, logout} = useAuth0()
    const nav = useNavigate()
    const {forumUser, appUser} = useTypedSelector(state => state.user)

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
            logoutParams: {
                returnTo: window.location.origin,
            },
        });
    }

    return (
        <Flex className={"ForumNavbarWrapper"} vertical gap={40}>

            <Flex vertical style={{ color: "black"}} gap={5}>
                <Button ghost icon={<HomeOutlined style={{color: "black"}} />}>Головна</Button>
                <Button ghost icon={<TagsOutlined />}>Теги</Button>
                <Button ghost icon={<QuestionCircleOutlined />}>Питання</Button>
                <Button ghost icon={<UserOutlined />} onClick={() => nav("/forum/users")}>Користувачі</Button>
            </Flex>

            {props.children}


            <Flex vertical>
                <span style={{color: "white", fontSize: 20, marginBottom: 5}}>Профіль</span>

                {(isAuthenticated && forumUser)
                    ?
                    <Flex gap={10} vertical>
                        <Flex gap={5} vertical={true}>
                            {forumUser.avatar.includes("http") ?
                                <Image style={{maxWidth: 170, width: "100%"}} src={forumUser.avatar}/>
                                :
                                <Image style={{maxWidth: 170, width: "100%"}} src={getImageV2Url(forumUser.avatar)}/>
                            }
                            <span style={{color: "black"}}>{user?.name}</span>
                            {/*<span>{user?.sub}</span>*/}
                        </Flex>

                        <Flex gap={5} vertical>
                           <ForumUserSettings user={forumUser}/>
                            <Button ghost icon={<LoginOutlined /> } onClick={onLogout}>Вихід</Button>
                        </Flex>
                    </Flex>
                    :
                    !isAuthenticated &&
                    <Button ghost  icon={<LoginOutlined /> } onClick={onLogin}>Вхід</Button>
                }
            </Flex>
        </Flex>
    );
};

export default ForumNavbar;