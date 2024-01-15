import React, {FC, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {App, Badge, Flex} from "antd";
import {
    Chat,
    DeleteMessageDto,
    DeleteMessageImageDto,
    LastReadMessageDto,
    Message,
    UpdateMessageDto,
    User
} from "../../API/services/forum/ForumInterfaces";
import {useStompClient, useSubscription} from "react-stomp-hooks";
import MessageList from "./MessageList/MessageList";
import ChatInput from "./ChatInput/ChatInput";
import ChatHeader from "./ChatHeader/ChatHeader";
import {IMessage} from "@stomp/stompjs/src/i-message";
import {useAuth0} from "@auth0/auth0-react";
import {DownOutlined} from "@ant-design/icons";
import {deleteMessageById} from "../../API/services/forum/MessageService";
import {AuthContext} from "../../context/AuthContext";
import chat_classes from './ChatWindow.module.css'

interface ChatProps {
    chat? : Chat
    messages : Array<Message>,
    setMessages :  React.Dispatch<React.SetStateAction<Message[]>>,
    chatId : number,
    typingUsers : Array<User>,
    setTypingUsers : React.Dispatch<React.SetStateAction<User[]>>,
    lastReadMessageId? : number
    setLastReadMessageId :  React.Dispatch<React.SetStateAction<number | undefined>>
    unreadMessagesCount? : number
    setUnreadMessagesCount : React.Dispatch<React.SetStateAction<number | undefined>>
    nextMessagePageBottom : () => void

}

const ChatWindow: FC<ChatProps> = ({
                                       messages,
                                       setMessages,
                                       chatId,
                                       chat,
                                       typingUsers,
                                       setTypingUsers,
                                       lastReadMessageId,
                                       setLastReadMessageId,
                                       unreadMessagesCount,
                                       setUnreadMessagesCount,
    nextMessagePageBottom
                                   }) => {


    const stompClient = useStompClient()
    const {user} = useAuth0()
    const lastMessageObserver = useRef<IntersectionObserver>()
    const [isScrollDownButtonActive, setIsScrollDownButtonActive] = useState<boolean>(false)
    const [input, setInput] = useState<string>('');
    const {jwt} = useContext(AuthContext)
    const {notification} = App.useApp();
    const [isNeedScrollToBottom, setIsNeedScrollToBottom] = useState<boolean>(false)

    const onUserDeletesMessage = (message : IMessage) => {
        const deletedMessageDto : DeleteMessageDto = JSON.parse(message.body)
        console.log("delete message event", deletedMessageDto)
        setMessages(messages.filter((msg) => msg.id !== deletedMessageDto.messageId))
    }

    const onUserDeletesMessageImage = (message : IMessage) => {
        const dto : DeleteMessageImageDto = JSON.parse(message.body)
        console.log("delete message image event", dto)
        let foundMessage : Message | undefined = messages.find((msg) => msg.id === dto.messageId)
        if (foundMessage) {
            let filtered = foundMessage.imagesList.filter((img) => img.imageId !== dto.imageId)
            foundMessage.imagesList = filtered
            messages[messages.indexOf(foundMessage)] = foundMessage
            setMessages([...messages])
        }
    }

    const onUserUpdatedMessage = (message : IMessage) => {
        const dto : UpdateMessageDto = JSON.parse(message.body)
        console.log("update message event", dto)
        let foundMessage : Message | undefined = messages.find((msg) => msg.id === dto.id)
        if (foundMessage) {
            foundMessage.text = dto.text
            messages[messages.indexOf(foundMessage)] = foundMessage
            setMessages([...messages])
        }
    }

    useSubscription(`/chat/` + chatId + "/deleteMessageEvent", onUserDeletesMessage)
    useSubscription(`/chat/` + chatId + "/deleteMessageImageEvent", onUserDeletesMessageImage)
    useSubscription(`/chat/` + chatId + "/updateMessageEvent", onUserUpdatedMessage)

    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = document.getElementById("msgId-" + messages[messages.length-1].id)

            const callBack: IntersectionObserverCallback = (entries, observer) => {
                if (entries[0].isIntersecting) {
                    console.log("isIntersecting, load...")
                    nextMessagePageBottom()
                    setIsScrollDownButtonActive(false)
                    setIsNeedScrollToBottom(true)
                } else {
                    setIsNeedScrollToBottom(false)
                    setIsScrollDownButtonActive(true)
                }
            }
            if (lastMessage) {
                const observer = new IntersectionObserver(callBack)
                observer.observe(lastMessage)

                if (lastMessageObserver.current) {
                    lastMessageObserver.current?.disconnect()
                }
                lastMessageObserver.current = observer
            }
        }
    }, [messages]);

    function isMyMessage(userId : string | undefined) {
        return userId === user?.sub
    }

    useEffect(() => {
        if (isNeedScrollToBottom) {
            scrollToBottom()
        }
    }, [isNeedScrollToBottom]);

    function scrollToBottom() {
        setTimeout(() => {
            const lastMessage = document.getElementById("msgId-" + messages[messages.length-1].id)
            lastMessage?.scrollIntoView({behavior: "smooth", block: 'center'});
        }, 5)
    }

    const onChatMessagesSubscribe = (message: IMessage) => {
        const data : Message = JSON.parse(message.body)

        if (isMyMessage(data.sender.id)) {
            scrollToBottom()
        }

        setInput('')
        let msg = messages === undefined ? [] : messages;
        if (chat !== undefined) {
            chat.totalMessagesAmount  = chat?.totalMessagesAmount + 1;
        }
        setMessages([...msg, data])
    }

    const saveLastReadMessageId = (messageId : number) => {
        if (user?.sub && stompClient) {
            setLastReadMessageId(messageId)
            const dto : LastReadMessageDto = {
                chatId: chatId,
                userId : user.sub,
                messageId : messageId
            }

            stompClient.publish({
                destination: '/app/userMessage/lastReadId/update', body: JSON.stringify(dto),
                headers: {
                    'content-type': 'application/json'
                }}
            )
        } else {
            throw new Error("saveLastReadMessageId error")
        }
    }

    useSubscription(`/chat/` + chatId, onChatMessagesSubscribe)

    const filterTypingUsers = (userId : string | undefined) => {
        if (userId) {
            const filtered = typingUsers.filter((user) => user.id !== userId)
            setTypingUsers(filtered)
        }
    }

    const toBottom = useCallback(() => {
        const lastMessage = document.getElementById("msgId-" + messages[messages.length-1].id)
        lastMessage?.scrollIntoView({behavior: "smooth", block: 'nearest'});
    }, [messages]);

    const [editMessage, setEditMessage] = useState<Message>()
    const [replyMessage, setReplyMessage] = useState<Message>()

    const onEditMessage = useCallback((message : Message) => {
        if (replyMessage) setReplyMessage(undefined)
        setEditMessage(message)
        setInput(message.text)
    }, [replyMessage]);

    const onReplyMessage = useCallback((message : Message) => {
        if (editMessage) setEditMessage(undefined)
        setReplyMessage(message)
    }, [editMessage]);

    const notifyThatMessageWasDeleted = (messageId : number) => {
        if (stompClient && chat?.id) {
            const body : DeleteMessageDto = {
                messageId : messageId,
                chatId : chat?.id
            }

            stompClient.publish({
                destination : "/app/userMessage/wasDeleted",
                body : JSON.stringify(body)
            })
        } else notification.error({message : "can't notify that deleted message"})
    }

    const onDeleteMessage = async (messageId : number) => {
        setEditMessage(undefined)
        setReplyMessage(undefined)
        if (jwt) {
            const {error} = await deleteMessageById(messageId, jwt)
            if (error) {
                notification.error({message: "can't delete message"})
            } else {
                setMessages(messages.filter((msg) => msg.id !== messageId))
                notifyThatMessageWasDeleted(messageId)
                notification.success({message: "Видалено успішно"})
            }
        }
    }

    return (
        <Flex className={chat_classes.chatWindow} justify={"space-between"} vertical={true}>
            <ChatHeader typingUsers={typingUsers}
                        chatId={chatId}
                        setTypingUsers={setTypingUsers}
                        chat={chat}
                        filterTypingUsers={filterTypingUsers}
            />
            <Flex style={{backgroundColor: "black", overflowY: "hidden"}}>
                <Flex vertical={true} className={chat_classes.chat} justify={"space-between"}>
                    <MessageList setUnreadMessagesCount={setUnreadMessagesCount}
                                 unreadMessagesCount={unreadMessagesCount}
                                 chat={chat}
                                 messages={messages}
                                 saveLastReadMessageId={saveLastReadMessageId}
                                 lastReadMessageId={lastReadMessageId}
                                 onEditMessage={onEditMessage}
                                 editMessage={editMessage}
                                 onReplyMessage={onReplyMessage}
                                 replyMessage={replyMessage}
                                 onDeleteMessage={onDeleteMessage}
                    />
                    <Flex style={{display: isScrollDownButtonActive ? "flex" : "none"}} onClick={toBottom} className={"unreadMessagesFloatButtonWrapper"}>
                        <Badge count={unreadMessagesCount} color={"#8f4c58"}>
                            <DownOutlined className={"unreadMessagesFloatButton"} />
                        </Badge>
                    </Flex>
                </Flex>
            </Flex>
            <ChatInput chatId={chatId}
                       input={input}
                       setInput={setInput}
                       stompClient={stompClient}
                       filterTypingUsers={filterTypingUsers}
                       editMessage={editMessage}
                       setEditMessage={setEditMessage}
                       replyMessage={replyMessage}
                       setReplyMessage={setReplyMessage}
            />
        </Flex>
    );
};

export default ChatWindow;