import React, {FC, useEffect, useState} from 'react';
import {Button, Flex, Image, Skeleton} from "antd";
import {IChat, ForumUserDto, TypingUser, User} from "../../../API/services/forum/ForumInterfaces";
import classes from './ChatHeader.module.css'
import {useSubscription} from "react-stomp-hooks";
import {IMessage} from "@stomp/stompjs/src/i-message";
import {LeftOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import ChatSettings from "../../ChatSettings/ChatSettings";

// @ts-ignore
import leftArrImg from '../../../assets/leftArr/arrow-left-2827.svg'
interface ChatHeaderProps {
    chat? : IChat,
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

    useSubscription(`/chat/` + chatId + "/userStopTyping", onUsersStopTyping)
    useSubscription(`/chat/` + chatId + "/typingUsers", onUsersStartTyping)

    return chat
        ?
        (<Flex vertical className={classes.chatHeader} >
            <Flex justify={"space-between"} align={"center"}>
                <Flex vertical>
                    <img className={classes.backBtn}
                         height={30}
                         width={60}
                         src={leftArrImg}
                         onClick={() => nav(-1)}
                    />
                    <span className={classes.chatName}>{chat.name}</span>
                    <span style={{ color:"var(--forum-primary-text-color)"}}>{chat.description}</span>
                </Flex>

                <Flex style={{height: "100%"}} gap={5}>
                    <span className={classes.chatMessagesAmount}>{chat.totalMessagesAmount} повідомлень</span>

                    <img
                           onClick={() => setIsSettingsActive(true)}
                           className={"nonSelect " + classes.chatPicture}
                           width={75}
                           height={75}
                           src={chat.picture}
                    />

                </Flex>
            </Flex>


            <Flex justify={"space-between"}>
                <Flex>
                    {typingUsers.length > 0 &&
                        <div className={classes.typing}>
                            <div className={classes.dot}></div>
                            <div className={classes.dot}></div>
                            <div className={classes.dot}></div>
                            <Flex>
                                {typingUsers.length > 0 &&
                                    typingUsers.map((user) =>
                                        <span key={"typingUser-" + user.id}>{user.firstName} пише...</span>
                                    )
                                }
                            </Flex>
                        </div>
                    }
                </Flex>
            </Flex>

            {isSettingsActive &&
                <ChatSettings chat={chat}  setIsSettingsActive={setIsSettingsActive} />
            }
        </Flex>)
        :
        (<Skeleton style={{height: 50}} active/>)

};

export default ChatHeader;