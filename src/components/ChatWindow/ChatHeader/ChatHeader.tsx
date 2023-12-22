import React, {FC, useEffect} from 'react';
import {Flex, Image, Skeleton} from "antd";
import {Chat, User} from "../../../API/services/forum/ForumInterfaces";
import classes from './ChatHeader.module.css'
interface ChatHeaderProps {
    chat? : Chat,
    typingUsers : Array<User>
}

const ChatHeader: FC<ChatHeaderProps> = ({chat, typingUsers}) => {

    useEffect(() => {
        console.log(typingUsers)
    }, [typingUsers]);

    return chat
        ?
        (<Flex vertical className={classes.chatHeader} gap={5}>
            <Flex justify={"space-between"}>
                <Flex gap={20} align={"center"}>
                    <span className={classes.chatName}>{chat.name}</span>
                    <span className={classes.chatDescription}>{chat.description}</span>
                </Flex>
                <Image preview={false}
                       className={"nonSelect " + classes.chatPicture}
                       width={50}
                       height={50}
                       src={chat.picture}
                />
            </Flex>

            <Flex justify={"space-between"}>
                <Flex>
                    {typingUsers.length > 0
                        ?
                        <div className={classes.typing}>
                            <div className={classes.dot}></div>
                            <div className={classes.dot}></div>
                            <div className={classes.dot}></div>
                            <Flex>
                                {typingUsers.length > 0
                                    ?
                                    typingUsers.map((user) =>
                                        <span key={"typingUser-" + user.id}>{user.name} пише...</span>
                                    )
                                    : <></>
                                }
                            </Flex>
                        </div>
                        :
                        <div></div>
                    }
                </Flex>
                <span>{chat.totalMessagesAmount} повідомлень</span>
            </Flex>
        </Flex>)
        :
        (<Skeleton style={{height: 50}} active/>)

};

export default ChatHeader;