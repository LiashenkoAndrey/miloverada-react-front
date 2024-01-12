import React, {FC} from 'react';
import {Flex, Image} from "antd";
import classes from "../AllForumTopicsPage.module.css";
import {Chat} from "../../../../API/services/forum/ForumInterfaces";
import {createSearchParams, useNavigate} from "react-router-dom";

interface ChatsListProps {
    chats?: Array<Chat>
    topicId? : number
}

const ChatsList: FC<ChatsListProps> = ({chats, topicId}) => {
    const nav = useNavigate()
    const onSelectChat = (chatId: number, topicId: number | undefined) => {
        const params = createSearchParams({topicId: String(topicId)}).toString()
        nav({
            pathname: "/chat/" + chatId,
            search: params
        })
    }

    return (
        <>
            {chats
                ?
                chats.map((chat) =>
                    <Flex key={"chat-" + chat.id} onClick={() => onSelectChat(chat.id, topicId)}
                          className={classes.chat}
                          gap={20}
                          justify={"space-between"}
                          align={"center"}
                    >
                        <Flex gap={15} style={{color :"var(--forum-secondary-title-color)"}} align={"center"}>
                            <Image src={chat.picture} preview={false} width={50} height={50}></Image>
                            {/*<WechatOutlined style={{fontSize: 30}}/>*/}
                            <h4>{chat.name}</h4>
                        </Flex>

                        <Flex gap={15}>
                            <Flex>
                                <span style={{color: "var(--forum-secondary-title-color)"}}>{chat.totalMessagesAmount} пов.</span>
                            </Flex>
                            <Flex gap={5}>
                                <Image style={{borderRadius: 20}} preview={false} width={30} height={30}
                                       src={chat.owner.avatar}></Image>
                            </Flex>
                        </Flex>
                    </Flex>
                )
                :
                <></>
            }

        </>
    )
};

export default ChatsList;