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
import {useActions} from "../../hooks/useActions";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {isMyMessage} from "../../API/services/forum/UserService";
import {MessageFileDto} from "../../API/services/forum/MessageDto";

interface ChatProps {
    chat? : Chat
    chatId : number,
    typingUsers : Array<User>,
    setTypingUsers : React.Dispatch<React.SetStateAction<User[]>>,
}

const ChatWindow: FC<ChatProps> = ({
                                       chatId,
                                       chat,
                                       typingUsers,
                                       setTypingUsers
                                   }) => {

    const {messages, unreadMessagesCount} = useTypedSelector(state => state.chat)
    const {setMsg, setUnreadMessagesCount} = useActions()

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
        setMsg(messages.filter((msg) => msg.id !== deletedMessageDto.messageId))
    }

    const onUserDeletesMessageImage = (message : IMessage) => {
        const dto : DeleteMessageImageDto = JSON.parse(message.body)
        let foundMessage : Message | undefined = messages.find((msg) => msg.id === dto.messageId)
        if (foundMessage) {
            let filtered = foundMessage.imagesList.filter((img) => img.imageId !== dto.imageId)
            foundMessage.imagesList = filtered
            messages[messages.indexOf(foundMessage)] = foundMessage
            setMsg([...messages])
        }
    }

    const onUserUpdatedMessage = (message : IMessage) => {
        const dto : UpdateMessageDto = JSON.parse(message.body)
        let foundMessage : Message | undefined = messages.find((msg) => msg.id === dto.id)
        if (foundMessage) {
            foundMessage.text = dto.text
            messages[messages.indexOf(foundMessage)] = foundMessage
            setMsg([...messages])
        }
    }

    function onMessageFileSaved(message : IMessage) {
        const dto : MessageFileDto = JSON.parse(message.body)
        console.log("onMessageFileSaved", dto)
        let foundMsg = messages.filter((message) => message.id === dto.messageId)[0]
        let msgIndex = messages.indexOf(foundMsg)
        let list = foundMsg.fileDtoList;
        console.log("list", list)
        let fileArr = list.filter((fileDto) => fileDto.name === dto.name)
        console.log("dto.name",dto.name, fileArr)
        let file = fileArr[0]

        let index = list.indexOf(file)

        file.mongoId = dto.mongoId
        file.isLarge = dto.isLarge
        file.messageId = dto.messageId

        list[index] = file;
        foundMsg.fileDtoList = list
        messages[msgIndex] = foundMsg
        console.log("changed messages", messages)
        setMsg(messages)
    }

    useSubscription(`/chat/` + chatId + "/deleteMessageEvent", onUserDeletesMessage)
    useSubscription(`/chat/` + chatId + "/deleteMessageImageEvent", onUserDeletesMessageImage)
    useSubscription(`/chat/` + chatId + "/updateMessageEvent", onUserUpdatedMessage)
    useSubscription(`/chat/` + chatId + "/messageFileSaved", onMessageFileSaved)

    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = document.getElementById("msgId-" + messages[messages.length-1].id)

            const scrollInBottomCallback: IntersectionObserverCallback = (entries) => {
                if (entries[0].isIntersecting) {
                    setUnreadMessagesCount(0)
                    saveLastReadMessageId(messages[messages.length-1].id)

                    setIsScrollDownButtonActive(false)
                    setIsNeedScrollToBottom(true)
                } else {
                    setIsNeedScrollToBottom(false)
                    setIsScrollDownButtonActive(true)
                }
            }
            if (lastMessage) {
                const observer = new IntersectionObserver(scrollInBottomCallback)
                observer.observe(lastMessage)

                if (lastMessageObserver.current) {
                    lastMessageObserver.current?.disconnect()
                }
                lastMessageObserver.current = observer
            }
        }
    }, [messages]);



    function scrollToBottom() {
        setTimeout(() => {
            const lastMessage = document.getElementById("msgId-" + messages[messages.length-1].id)
            lastMessage?.scrollIntoView({behavior: "smooth", block: 'center'});
        }, 5)
    }

    const onChatMessagesSubscribe = (message: IMessage) => {
        const data : Message = JSON.parse(message.body)
        console.log("new msg", data)
        if (isMyMessage(data.sender.id, user?.sub) || isNeedScrollToBottom) {
            scrollToBottom()
        }

        setInput('')
        let msg = messages === undefined ? [] : messages;
        if (chat !== undefined) {
            chat.totalMessagesAmount  = chat?.totalMessagesAmount + 1;
        }
        setMsg([...msg, data])
    }

    const saveLastReadMessageId = (messageId : number) => {
        if (user?.sub && stompClient !== undefined) {
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

    const setEditMessageCustom = (msg : Message | undefined) => {
        setEditMessage(msg)
    }

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
                setMsg(messages.filter((msg) => msg.id !== messageId))
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
            <Flex style={{backgroundColor: "black", overflowY: "hidden", flexGrow: 1}}>
                <Flex vertical={true} className={chat_classes.chat} justify={"space-between"}>
                    <MessageList
                                 chat={chat}
                                 saveLastReadMessageId={saveLastReadMessageId}
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