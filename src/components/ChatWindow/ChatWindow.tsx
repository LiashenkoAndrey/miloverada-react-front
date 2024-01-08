import React, {CSSProperties, FC, useCallback, useEffect, useRef, useState} from 'react';
import {Badge, Button, Flex} from "antd";
import {
    Chat,
    DeleteMessageDto, DeleteMessageImageDto,
    ForumUserDto,
    LastReadMessageDto,
    Message, UpdateMessageDto,
    User
} from "../../API/services/forum/ForumInterfaces";
import {useStompClient, useSubscription} from "react-stomp-hooks";
import MessageList from "./MessageList/MessageList";
import ChatInput from "./ChatInput/ChatInput";
import ChatHeader from "./ChatHeader/ChatHeader";
import {IMessage} from "@stomp/stompjs/src/i-message";
import {useAuth0} from "@auth0/auth0-react";
import {DownOutlined} from "@ant-design/icons";

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
                } else {
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

    const onChatMessagesSubscribe = (message: IMessage) => {
        const data = JSON.parse(message.body)
        // console.log("new message", data)
        setInput('')
        let msg = messages === undefined ? [] : messages;
        if (chat !== undefined) {
            chat.totalMessagesAmount  = chat?.totalMessagesAmount + 1;
        }
        setMessages([...msg, data])
    }

    const saveLastReadMessageId = (messageId : number) => {
        if (user?.sub && stompClient) {
            // console.log("save", messageId, lastReadMessageId)
            setLastReadMessageId(messageId)
            const dto : LastReadMessageDto = {
                chatId: chatId,
                userId : user.sub,
                messageId : messageId
            }

            // console.log("update or save last read message", dto)
            stompClient.publish({
                destination: '/app/userMessage/lastReadId/update', body: JSON.stringify(dto),
                headers: {
                    'content-type': 'application/json'
                }}
            )
        } else {
            console.log(user?.sub, stompClient)
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
        lastMessage?.scrollIntoView({behavior: "smooth", block: 'end'});
    }, [messages]);

    const [editMessage, setEditMessage] = useState<Message>()

    const onEditMessage = (message : Message) => {
        setEditMessage(message)
        setInput(message.text)
    }


    return (
        <Flex vertical={true}>
            <ChatHeader typingUsers={typingUsers}
                        chatId={chatId}
                        setTypingUsers={setTypingUsers}
                        chat={chat}
                        filterTypingUsers={filterTypingUsers}
            />
            <Flex vertical={true} className={"chat"} justify={"space-between"}>

                    <MessageList setUnreadMessagesCount={setUnreadMessagesCount}
                                 unreadMessagesCount={unreadMessagesCount}
                                 setMessages={setMessages}
                                 chat={chat}
                                 messages={messages}
                                 saveLastReadMessageId={saveLastReadMessageId}
                                 lastReadMessageId={lastReadMessageId}
                                 onEditMessage={onEditMessage}
                                 editMessage={editMessage}
                    />
                    <Flex style={{display: isScrollDownButtonActive ? "flex" : "none"}} onClick={toBottom} className={"unreadMessagesFloatButtonWrapper"}>
                        <Badge count={unreadMessagesCount} color={"#8f4c58"}>
                            <DownOutlined className={"unreadMessagesFloatButton"} />
                        </Badge>
                    </Flex>
                <ChatInput chatId={chatId}
                           input={input}
                           setInput={setInput}
                           stompClient={stompClient}
                           filterTypingUsers={filterTypingUsers}
                           editMessage={editMessage}
                           setEditMessage={setEditMessage}
                />
            </Flex>
        </Flex>
    );
};

export default ChatWindow;