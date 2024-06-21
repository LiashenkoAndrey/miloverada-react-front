import React, {FC} from 'react';
import {Button, Flex, Image, Tooltip} from "antd";
import {toDateShort} from "../../API/Util";
import classes from "../../pages/forum/Message/Message.module.css";
import {User} from "../../API/services/forum/ForumInterfaces";
import {useAuth0} from "@auth0/auth0-react";
import {useNavigate} from "react-router-dom";
import {getImageV2Url} from "../../API/services/ImageService";

interface UserPictureProps  {
    user : User
}

const UserPicture: FC<UserPictureProps> = ({user}) => {
    const nav = useNavigate()
    const auth0 = useAuth0()

    const onUserStartChatButtonClick = () => {
        if (auth0.user?.sub) {
            nav(`/forum/user/${user.id}/chat`)
        } else console.log("user sub null")
    }

    function isMine(id : string) {
        if (auth0.user?.sub) {
            return auth0.user.sub === id
        }
        return false;
    }

    return (
        <Tooltip title={<Flex style={{maxWidth: 300}} gap={5}>
            <div style={{width: 150, maxHeight: 150}}>
                {!user.avatar.includes("http")
                    ?
                    <Image src={getImageV2Url(user.avatar)}/>
                    :
                    <Image src={user.avatar}/>
                }
            </div>
            <Flex gap={5} justify={"space-between"} vertical>

                <Flex gap={5} vertical>

                    <span>{user.firstName}</span>
                    <span>{user.lastName}</span>

                    {user.registeredOn &&
                        <span>Зареєстрований(на): {toDateShort(user.registeredOn)}</span>
                    }
                </Flex>
                <Flex>
                    {!isMine(user.id) &&
                        <Button disabled={!auth0.isAuthenticated}
                                onClick={onUserStartChatButtonClick}
                        >
                            Написати
                        </Button>
                    }
                </Flex>
            </Flex>
        </Flex>}
                 color={"rgba(70,85,93,0.94)"}
                 placement="topRight"
                 trigger={"click"}
        >
            <div style={{marginTop: 4}}>
                <Image
                    preview={false}
                    style={{cursor: "pointer"}}
                    className={classes.messageImg + " nonSelect"}
                    width={35}
                    height={35}
                    src={user.avatar}
                />
            </div>
        </Tooltip>
    );
};

export default UserPicture;
