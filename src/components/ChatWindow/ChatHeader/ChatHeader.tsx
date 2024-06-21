import React, {FC, useState} from 'react';
import {Drawer, Flex, Skeleton} from "antd";
import {ForumUserDto, IChat, TypingUser} from "../../../API/services/forum/ForumInterfaces";
import classes from './ChatHeader.module.css'
import {useSubscription} from "react-stomp-hooks";
import {IMessage} from "@stomp/stompjs/src/i-message";
import {useNavigate} from "react-router-dom";
import ChatSettings from "../../ChatSettings/ChatSettings";

// @ts-ignore
import leftArrImg from '../../../assets/leftArr/arrow-left-2827.svg'
import {useTypedSelector} from "../../../hooks/useTypedSelector";

interface ChatHeaderProps {
    typingUsers : Array<TypingUser>
    setTypingUsers : React.Dispatch<React.SetStateAction<TypingUser[]>>
    chatId : number
    filterTypingUsers ( userId: string | undefined) : void
}

const ChatHeader: FC<ChatHeaderProps> = ({
                                             typingUsers,
                                             setTypingUsers,
                                             chatId,
                                             filterTypingUsers
                                         }) => {
    const {chatInfo, privateChatInfo} = useTypedSelector(state => state.chat)
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


    const [open, setOpen] = useState(false);
    const showDrawer = () => {
        console.log("ok")
        setOpen(true);
    };


    return <Flex vertical className={classes.chatHeader} >

            <Flex justify={"space-between"} align={"center"}>
                <Flex vertical>
                    <img className={classes.backBtn}
                         height={30}
                         width={60}
                         src={leftArrImg}
                         onClick={() => nav(-1)}
                    />
                    {chatInfo &&
                        <span className={classes.chatName}>{chatInfo.name}</span>
                    }

                    {/*{privateChatInfo &&*/}
                    {/*    <span className={classes.chatName}>{privateChatInfo.receiver.nickname}</span>*/}
                    {/*}*/}
                    {!chatInfo && !privateChatInfo &&
                        <Flex vertical gap={3} style={{marginBottom: 2}} >
                            <Skeleton.Input active/>
                            <Skeleton.Input  size={"small"} active/>

                        </Flex>
                    }
                    {(chatInfo && privateChatInfo === null) &&
                        <span style={{ color:"var(--forum-primary-text-color)", userSelect: "none"}} >{chatInfo.description}</span>
                    }
                </Flex>

                <Flex gap={5} style={{height: "100%"}}>
                    {chatInfo ?
                        <span className={classes.chatMessagesAmount}>{chatInfo.totalMessagesAmount} повідомлень, {chatInfo.totalMembersAmount} учасників(а)</span>
                        :
                        <Flex style={{alignSelf: "flex-end", height: 20}}>
                            <Skeleton.Input  size={"small"} active/>
                        </Flex>
                    }

                    {chatInfo ?
                        chatInfo.picture ?
                        <img
                            onClick={showDrawer}
                            className={["nonSelect", classes.chatPicture, "imageWithPlaceholder"].join(' ')}
                            width={75}

                            height={75}
                            src={privateChatInfo ? privateChatInfo.receiver.avatar : chatInfo.picture}
                        />
                            :
                            <Flex
                                onClick={showDrawer}
                                className={classes.noPicWrapper}
                                justify={"center"}
                                align={"center"}
                            >
                                <span className={classes.noPicText}>
                                    {chatInfo.name.charAt(0)}

                                </span>
                            </Flex>
                        :

                        <Skeleton.Image style={{height: "100%"}} active/>
                    }


                </Flex>
            </Flex>

        {typingUsers.length > 0 &&
            <Flex justify={"space-between"}
                  style={{position: "absolute"}}
                  className={classes.typingUsersWrapper}
            >
                <Flex>
                    <div className={classes.typing}>
                        <div className={classes.dot}></div>
                        <div className={classes.dot}></div>
                        <div className={classes.dot}></div>
                        <Flex>
                            {typingUsers.length > 0 &&
                                typingUsers.map((user) =>
                                    <span key={"typingUser-" + user.id}
                                          className={classes.typingUserName}>{user.firstName} пише...</span>
                                )
                            }
                        </Flex>
                    </div>
                </Flex>
            </Flex>
        }


        <ChatSettings open={open} setOpen={setOpen}  />
        </Flex>

};

export default ChatHeader;
