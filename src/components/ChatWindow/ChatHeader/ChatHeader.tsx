import React, {FC} from 'react';
import {Button, Flex, Image, Skeleton} from "antd";
import {Chat, ForumUserDto, User} from "../../../API/services/forum/ForumInterfaces";
import classes from './ChatHeader.module.css'
import {useSubscription} from "react-stomp-hooks";
import {IMessage} from "@stomp/stompjs/src/i-message";
import {LeftOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

interface ChatHeaderProps {
    chat? : Chat,
    typingUsers : Array<User>
    setTypingUsers : React.Dispatch<React.SetStateAction<User[]>>
    chatId : number
    filterTypingUsers ( userId: string | undefined) : void
}

const ChatHeader: FC<ChatHeaderProps> = ({
                                             chat,
                                             typingUsers,
                                             setTypingUsers,
                                             chatId,
                                             filterTypingUsers
                                         }) => {

    const nav = useNavigate()
    const onUsersStartTyping = (message : IMessage) => {
        console.log("start typing", message)
        const userDto : ForumUserDto = JSON.parse( message.body)
        setTypingUsers([{name: userDto.name, id: userDto.id},...typingUsers])
    }

    const onUsersStopTyping = (message : IMessage) => {
        const data : ForumUserDto = JSON.parse( message.body)
        filterTypingUsers(data.id)
    }

    useSubscription(`/chat/` + chatId + "/userStopTyping", onUsersStopTyping)
    useSubscription(`/chat/` + chatId + "/typingUsers", onUsersStartTyping)

    return chat
        ?
        (<Flex vertical className={classes.chatHeader} >
            <Button onClick={() => nav(-1)}
                    style={{maxWidth: 100, color: "black", padding: 0}}
                    icon={<LeftOutlined/>}
                    type={"text"}>
                Назад
            </Button>
            <Flex justify={"space-between"}>


                <Flex gap={20} align={"center"}>
                    <span className={classes.chatName}>{chat.name}</span>
                    <span className={classes.chatDescription}>{chat.description}</span>
                </Flex>
                <Image preview={false}
                       className={"nonSelect " + classes.chatPicture}
                       width={40}
                       height={40}
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