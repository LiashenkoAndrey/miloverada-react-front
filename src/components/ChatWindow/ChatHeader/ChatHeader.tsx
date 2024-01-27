import React, {FC, useEffect, useState} from 'react';
import {Button, Flex, Image, Skeleton} from "antd";
import {Chat, ForumUserDto, TypingUser, User} from "../../../API/services/forum/ForumInterfaces";
import classes from './ChatHeader.module.css'
import {useSubscription} from "react-stomp-hooks";
import {IMessage} from "@stomp/stompjs/src/i-message";
import {LeftOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import ChatSettings from "../../ChatSettings/ChatSettings";

interface ChatHeaderProps {
    chat? : Chat,
    typingUsers : Array<TypingUser>
    setTypingUsers : React.Dispatch<React.SetStateAction<TypingUser[]>>
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

    const [isSettingsActive, setIsSettingsActive] = useState<boolean>(false)
    const nav = useNavigate()
    const onUsersStartTyping = (message : IMessage) => {
        const userDto : ForumUserDto = JSON.parse( message.body)
        setTypingUsers([{firstName: userDto.name, id: userDto.id},...typingUsers])
    }

    const onUsersStopTyping = (message : IMessage) => {
        const data : ForumUserDto = JSON.parse( message.body)
        filterTypingUsers(data.id)
    }

    useEffect(() => {
        console.log(chat)
    }, [chat]);

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
                </Flex>
                <Image preview={false}
                       onClick={() => setIsSettingsActive(true)}
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
                                        <span key={"typingUser-" + user.id}>{user.firstName} пише...</span>
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

            {isSettingsActive &&
                <ChatSettings chat={chat}  setIsSettingsActive={setIsSettingsActive} />
            }
        </Flex>)
        :
        (<Skeleton style={{height: 50}} active/>)

};

export default ChatHeader;