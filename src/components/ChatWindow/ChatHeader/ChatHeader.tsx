import React, {FC, useState} from 'react';
import {Flex, Skeleton} from "antd";
import classes from './ChatHeader.module.css'
import {useNavigate} from "react-router-dom";
import ChatSettings from "../../ChatSettings/ChatSettings";

// @ts-ignore
import leftArrImg from '../../../assets/leftArr/arrow-left-2827.svg'
import {useTypedSelector} from "../../../hooks/useTypedSelector";

interface ChatHeaderProps {
}

const ChatHeader: FC<ChatHeaderProps> = ({}) => {

    const {chatInfo, privateChatInfo} = useTypedSelector(state => state.chat)
    const [isSettingsActive, setIsSettingsActive] = useState<boolean>(false)
    const nav = useNavigate()


    const [open, setOpen] = useState(false);
    const showDrawer = () => {
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

                    {!chatInfo && !privateChatInfo &&
                        <Flex vertical gap={3} style={{marginBottom: 2}} >
                            <Skeleton.Input active/>
                            <Skeleton.Input  size={"small"} active/>

                        </Flex>
                    }
                    {chatInfo &&
                        <span style={{ color:"var(--forum-primary-text-color)", userSelect: "none"}} >{chatInfo.description}</span>
                    }
                </Flex>

                <Flex gap={5} style={{height: "100%"}}>
                    {chatInfo ?
                        <span className={classes.chatMessagesAmount}>
                            {chatInfo.totalMessagesAmount} повідомлень{chatInfo.isPrivate ? "" : `, ${chatInfo.totalMembersAmount} учасників(а)`}
                        </span>
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
                                    {chatInfo?.name?.charAt(0)}

                                </span>
                            </Flex>
                        :

                        <Skeleton.Image style={{height: "100%"}} active/>
                    }
                </Flex>
            </Flex>

        <ChatSettings open={open} setOpen={setOpen}  />
        </Flex>

};

export default ChatHeader;
