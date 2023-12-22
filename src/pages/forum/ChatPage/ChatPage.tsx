import React, {useEffect, useState} from 'react';
import {Breadcrumb, Button, Flex, Image, Skeleton} from "antd";
import {getAllChatsByThemeId, getAllMessagesByChatId, getChatById} from "../../../API/services/forum/ChatService";
import {LeftOutlined, WechatOutlined} from "@ant-design/icons";
import {Chat, Message, User} from "../../../API/services/forum/ForumInterfaces";
import './ChatPage.css'
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import ForumWrapper from "../../../components/ForumWrapper/ForumWrapper";
import ChatWindow from "../../../components/ChatWindow/ChatWindow";
import {StompSessionProvider} from "react-stomp-hooks";

const ChatPage = () => {

    const [chats, setChats] = useState<Array<Chat>>([])
    const [messages, setMessages] = useState<Array<Message>>([])
    const {id} = useParams()
    const [searchParams] = useSearchParams();
    const nav = useNavigate()
    const [currentChatId, setCurrentChatId] = useState<number>(Number(id))
    const [chat, setChat] = useState<Chat>();
    const [typingUsers, setTypingUsers] = useState<Array<User>>([]);

    useEffect(() => {
        const getChats = async () => {
            const {data, error} = await getAllChatsByThemeId(Number(searchParams.get("topicId")));
            if (data) {
                setChats(data)
            }
            if (error) throw error;
        }
        getChats()
    }, []);

    const getMessages = async (chatId : number) => {
        if (!id) throw new Error("chat id is not present.")
        const {data, error} = await getAllMessagesByChatId(Number(chatId));
        if (data) {
            setMessages(data)
        }
        if (error) throw error;
    }

    useEffect(() => {
        getMessages(Number(id))
        changeChat(Number(id))
    }, []);

    const changeChat = async (chatId : number) => {
        const {data, error} = await getChatById(chatId);
        if (data) {
            setChat(data)
        }
        if (error) throw error;
    }




    const onChatChanged = async (chatId : number) => {
        if (chatId !== currentChatId) {
            setCurrentChatId(chatId)
            setTypingUsers([])
            getMessages(chatId)
            changeChat(chatId)
        }
    }

    return (
        <ForumWrapper style={{maxWidth: "90vw", width: "100%"}}>
            <Flex gap={5} vertical style={{marginTop: "5vh"}}>
                <Flex vertical={false} align={"center"} gap={30}>

                    <Button onClick={() => nav(-1)}
                            style={{maxWidth: 150, color: "white"}}
                            icon={<LeftOutlined/>}
                            type={"text"}>
                        Назад
                    </Button>

                    <Breadcrumb style={{color: "white"}}>
                        <Breadcrumb.Item>
                            <Button onClick={() => nav("/")}
                                    type={"text"}
                                    size={"small"}
                                    style={{color: "white"}}>
                                Головна
                            </Button>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </Flex>

                {chats
                    ?
                    chats.map((chat) =>
                        <Flex className={"chatBarItem"}
                              key={"chat-" + chat.id}
                              align={"center"} gap={20}
                              onClick={() => onChatChanged(Number(chat.id))}
                        >
                            <WechatOutlined style={{fontSize: 30}}/>
                            <Flex vertical>
                                <p>{chat.name}</p>
                                <span>{chat.description}</span>
                            </Flex>
                        </Flex>
                    )
                    :
                    <Skeleton/>
                }
            </Flex>


            <StompSessionProvider
                url={'http://localhost:8080/ws-endpoint'}
            >
                <ChatWindow typingUsers={typingUsers}
                            setTypingUsers={setTypingUsers}
                            chat={chat}
                            setChat={setChat}
                            chatId={currentChatId}
                            setMessages={setMessages}
                            messages={messages}
                />
            </StompSessionProvider>

        </ForumWrapper>
    );
};

export default ChatPage;