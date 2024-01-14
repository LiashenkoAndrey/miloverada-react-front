import React, {FC} from 'react';
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
interface ForumNavbarProps {
    children?: React.ReactNode;
}

const ForumNavbar : FC<ForumNavbarProps> = (props) => {
    const {isAuthenticated, loginWithRedirect, user, logout} = useAuth0()
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
                <Button icon={<HomeOutlined style={{color: "black"}} />}>Головна</Button>
                <Button icon={<TagsOutlined />}>Теги</Button>
                <Button icon={<QuestionCircleOutlined />}>Питання</Button>
                <Button icon={<UserOutlined />}>Користувачі</Button>
            </Flex>

            {props.children}


            <Flex vertical>
                <span style={{color: "black", fontSize: 20, marginBottom: 5}}>Профіль</span>

                {isAuthenticated
                    ?
                    <Flex gap={10} vertical>
                        <Flex gap={5} vertical={true}>
                            <Image width={110} src={user?.picture}/>
                            <span style={{color: "black"}}>{user?.name}</span>
                            {/*<span>{user?.sub}</span>*/}
                        </Flex>

                        <Flex gap={5} vertical>
                            <Button icon={<SettingOutlined /> } >Налаштування</Button>
                            <Button icon={<LoginOutlined /> } onClick={onLogout}>Вихід</Button>
                        </Flex>
                    </Flex>
                    :
                    <Button  icon={<LoginOutlined /> } onClick={onLogin}>Вхід</Button>
                }
            </Flex>
        </Flex>
    );
};

export default ForumNavbar;