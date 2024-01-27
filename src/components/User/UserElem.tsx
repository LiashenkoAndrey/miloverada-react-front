import React, {FC} from 'react';
import {User} from "../../API/services/forum/ForumInterfaces"
import {Button, Flex, Image} from "antd";
import userClasses from "./User.module.css"
import {toDateShort} from "../../API/Util";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

interface UserProps {
    user : User
}

const UserElem:FC<UserProps> = ({user}) => {
    const nav = useNavigate()
    const auth0 = useAuth0()
    const onUserStartChatButtonClick = () => {
        if (auth0.user?.sub) {
            nav("/forum/user/" + user.id + "/chat")
        } else console.log("user sub null")
    }

    return (
        <Flex justify={"space-between"} gap={5} align={"center"} className={userClasses.user}>
            <Flex>
                <Image src={user.avatar}/>
                <span className={userClasses.name}>{user.firstName} {user.lastName}</span>
            </Flex>

            <Flex vertical align={"center"} style={{marginRight: 5}}>

                {user.registeredOn &&
                    <span className={userClasses.date}>{toDateShort(user.registeredOn)}</span>
                }
                <Button onClick={onUserStartChatButtonClick}>Написати</Button>
            </Flex>
        </Flex>
    );
};

export default UserElem;