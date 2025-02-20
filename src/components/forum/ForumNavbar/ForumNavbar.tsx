import React, {FC} from 'react';
import {Button, Flex, Image, Tooltip} from "antd";
import {HomeOutlined, LoginOutlined, QuestionCircleOutlined, TagsOutlined, UserOutlined} from "@ant-design/icons";
import {useAuth0} from "@auth0/auth0-react";
import './ForumNavbar.css'
import {useNavigate} from "react-router-dom";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import ForumUserSettings from "../ForumUserSettings/ForumUserSettings";
import {getImageV2Url} from "../../../API/services/shared/ImageService";

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
                <Button ghost icon={<HomeOutlined />}>Головна</Button>
                {/*<Button ghost icon={<TagsOutlined />}>Теги</Button>*/}
                {/*<Button ghost icon={<QuestionCircleOutlined />}>Питання</Button>*/}
                <Button ghost icon={<UserOutlined />} onClick={() => nav("/forum/users")}>Користувачі</Button>
            </Flex>

            {props.children}


            <Flex vertical>
                <span style={{color: "white", fontSize: 20, marginBottom: 5, userSelect: 'none'}}>Профіль</span>

                {(isAuthenticated && forumUser)
                    ?
                    <Flex gap={10} vertical>
                        <Flex gap={5} vertical={true}>
                            {forumUser.avatar.includes("http") ?
                                <Image style={{maxWidth: 170, width: "100%"}} src={forumUser.avatar}/>
                                :
                                <Image style={{maxWidth: 170, width: "100%"}} src={getImageV2Url(forumUser.avatar)}/>
                            }
                            <span style={{color: "white"}}>{user?.name}</span>
                            {/*<span>{user?.sub}</span>*/}
                        </Flex>

                        <Flex gap={5} vertical>
                           <ForumUserSettings user={forumUser}/>
                            <Button style={{userSelect: "none"}} ghost icon={<LoginOutlined /> } onClick={onLogout}>Вихід</Button>
                        </Flex>
                    </Flex>
                    :
                    !isAuthenticated &&
                    <Tooltip rootClassName={"maxWidth200"}
                             placement={"bottomLeft"}
                             open
                             color={"white"}
                             title={<span style={{color: "black", userSelect: "none"}}>Ввійдіть щоб повноцінно користуватися форумом!</span>}
                    >
                        <Button ghost style={{userSelect: "none"}} icon={<LoginOutlined /> } onClick={onLogin}>Вхід</Button>
                    </Tooltip>
                }
            </Flex>
        </Flex>
    );
};

export default ForumNavbar;
