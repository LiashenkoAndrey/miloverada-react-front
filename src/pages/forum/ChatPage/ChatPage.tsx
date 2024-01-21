import React, {useEffect, useState} from 'react';
import {Breadcrumb, Button, Flex, Image, Skeleton} from "antd";
import {
    getAllChatsByThemeId,
    getChatById,
    getChatMetadata,
    getMessagesByChatIdAndLastReadMessage
} from "../../../API/services/forum/ChatService";
import {LeftOutlined} from "@ant-design/icons";
import {Chat, ChatMetadata, User} from "../../../API/services/forum/ForumInterfaces";
import './ChatPage.css'
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import ChatWindow from "../../../components/ChatWindow/ChatWindow";
import {StompSessionProvider} from "react-stomp-hooks";
import {useAuth0} from "@auth0/auth0-react";
import {getLatestMessagesOfChat} from "../../../API/services/forum/MessageService";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {useActions} from "../../../hooks/useActions";
import {MESSAGE_LOAD_PORTION_SIZE} from "../../../Constants";


const ChatPage = () => {

    const [chats, setChats] = useState<Array<Chat>>([])

    const {messages, chatId} = useTypedSelector(state => state.chat)
    const {setMsg, fetchPreviousMessages, setChatId, setHasPreviousMessages, setHasNextMessages, setIsScrolling} = useActions()
    const {id} = useParams()
    const [searchParams] = useSearchParams();
    const nav = useNavigate()
    const [currentChatId, setCurrentChatId] = useState<number>(Number(id))
    const [chat, setChat] = useState<Chat>();
    const [typingUsers, setTypingUsers] = useState<Array<User>>([]);
    const {user, isAuthenticated} = useAuth0()
    const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>()

    const [lastReadMessageId, setLastReadMessageId] = useState<number>()


    useEffect(() => {
        setHasPreviousMessages(true)
    }, []);

    useEffect(() => {
        setChatId(Number(id))

        const getChats = async () => {
            const {data, error} = await getAllChatsByThemeId(Number(searchParams.get("topicId")));
            if (data) {

                setChats(data)
            }
            if (error) throw error;
        }
        getChats()
    }, []);


    const scrollToBottom = () => {
        const chatBottom = document.getElementById("chatBottom")
        chatBottom?.scrollIntoView({behavior: "smooth", block: 'nearest'});
    }

    const getMetadataAndLoadMessages = async  (chatId : number) => {
        if (user?.sub) {
            const chatMetadata = await getChatMetadata(chatId, encodeURIComponent(user.sub))
            if (chatMetadata.data) {
                const metadata : ChatMetadata = chatMetadata.data
                if (metadata.last_read_message_id) {
                    setHasNextMessages(true)
                }
                setLastReadMessageId(metadata.last_read_message_id)
                setUnreadMessagesCount(metadata.unread_messages_count)

                if (!metadata.last_read_message_id) {
                    setHasNextMessages(false)
                    getLatestOfChat()
                    return
                }

                const {data, error} = await getMessagesByChatIdAndLastReadMessage(Number(chatId), 0, MESSAGE_LOAD_PORTION_SIZE*2,  metadata.last_read_message_id);
                if (data) {
                    setMsg(data)

                    setTimeout(() => {
                        const lastReadMsg = document.getElementById(`msgId-${metadata.last_read_message_id}`)
                        console.log("scrtoll to", lastReadMsg)
                        lastReadMsg?.scrollIntoView({behavior: "auto", block: 'end'});
                    },  100)

                }
                if (error) throw error;

            }
            if (chatMetadata.error) throw chatMetadata.error
        }
    }



    useEffect( () => {
        if (isAuthenticated) {
            getMetadataAndLoadMessages(Number(id))
        } else {
            console.log("not auth")
            getLatestOfChat()
        }
        changeChat(Number(id))
    }, []);

    const getLatestOfChat = async () => {
        const {data, error} = await getLatestMessagesOfChat(Number(id))
        if (data) {
            setMsg(data)
            setTimeout(() => {
                scrollToBottom()
            }, 100)
        }
        if (error) throw error;
    }

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
            getMetadataAndLoadMessages(chatId)
            changeChat(chatId)
        }
    }

    const loadPreviousMsg = async () => {
        console.log("fetchPreviousMessages invoke")
        fetchPreviousMessages(Number(id), messages)
    }

    const showState = async () => {
        console.log("state:", messages.length, chatId)
    }

    return (
        <Flex className={"chatPageWrapper"} align={"flex-start"} justify={"center"}>
            <Flex className={"chatWrapper"}  gap={20} justify={"center"}>
                <Flex justify={"flex-start"} className={"chatsWrapper"} vertical>
                    <Flex  justify={"center"} vertical={false} align={"center"} gap={30}>

                        <Button onClick={() => nav(-1)}
                                style={{maxWidth: 150, color: "black"}}
                                icon={<LeftOutlined/>}
                                type={"text"}>
                            Назад
                        </Button>

                        <Breadcrumb style={{color: "black"}}>
                            <Breadcrumb.Item>
                                <Button onClick={() => nav("/")}
                                        type={"text"}
                                        size={"small"}
                                        style={{color: "black"}}>
                                    Головна
                                </Button>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </Flex>

                    {chats.length > 0
                        ?
                        chats.map((chat) =>
                            <Flex className={"chatBarItem"}
                                  key={"chat-" + chat.id}
                                  align={"center"} gap={20}
                                  onClick={() => onChatChanged(Number(chat.id))}
                            >
                                <Image preview={false} src={chat.picture} width={50} height={50}/>
                                <Flex vertical>
                                    <p>{chat.name}</p>
                                    <span>{chat.description}</span>
                                </Flex>
                            </Flex>
                        )
                        :
                        <Skeleton/>
                    }
                    <Button onClick={loadPreviousMsg}>load top</Button>
                    <Button onClick={showState}>state</Button>
                </Flex>


                <StompSessionProvider url={'http://localhost:6060/ws-endpoint'}>
                    <ChatWindow typingUsers={typingUsers}
                                setTypingUsers={setTypingUsers}
                                chat={chat}
                                chatId={currentChatId}
                                lastReadMessageId={lastReadMessageId}
                                setLastReadMessageId={setLastReadMessageId}
                                unreadMessagesCount={unreadMessagesCount}
                                setUnreadMessagesCount={setUnreadMessagesCount}

                    />
                </StompSessionProvider>
            </Flex>
        </Flex>


    );
};

export default ChatPage;