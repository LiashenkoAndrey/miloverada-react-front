import React, {FC} from 'react';
import {ForumUser} from "../../../API/services/forum/ForumInterfaces"
import {Button, Flex, Image} from "antd";
import userClasses from "./User.module.css"
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import {getImageV2Url} from "../../../API/services/shared/ImageService";

interface UserProps {
    user: ForumUser
}

const UserElem: FC<UserProps> = ({user}) => {
    const nav = useNavigate()
    const auth0 = useAuth0()
    const onUserStartChatButtonClick = () => {
        if (auth0.user?.sub) {
            nav("/forum/user/" + user.id + "/chat")
        } else console.log("user sub null")
    }


    return (
        <Flex justify={"space-between"}
              gap={5}
              align={"center"}
              className={userClasses.user}
        >
            <Flex>
                {!user.avatar.includes("http")
                    ?
                    <Image className={"imageWithPlaceholder"}
                           style={{minWidth: 100, minHeight: 100, maxWidth: 100}}
                           src={getImageV2Url(user.avatar)}
                    />
                    :
                    <Image className={"imageWithPlaceholder"}
                           style={{minWidth: 100, minHeight: 100}}
                           src={user.avatar}
                    />
                }

                <Flex gap={10}
                      vertical
                      style={{padding: 10}}
                >
                    <span className={userClasses.name}>{user.nickname}</span>
                    <span className={userClasses.about}>{user.aboutMe}</span>
                </Flex>
            </Flex>

            <Flex vertical
                  align={"center"}
                  style={{marginRight: 5}}
            >
                <Button onClick={onUserStartChatButtonClick}>Написати</Button>
            </Flex>
        </Flex>
    );
};

export default UserElem;
