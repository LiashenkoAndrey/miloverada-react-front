import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {Badge, Button, Flex} from "antd";
import {Chat, LastReadMessageDto, Message, User} from "../../API/services/forum/ForumInterfaces";
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

    return (
        <Flex vertical={true}>
            {/*<Button onClick={() => nextMessagePageBottom()}>Next</Button>*/}
            <ChatHeader typingUsers={typingUsers}
                        chatId={chatId}
                        setTypingUsers={setTypingUsers}
                        chat={chat}
                        filterTypingUsers={filterTypingUsers}
            />
            <Flex vertical={true} className={"chat"} justify={"space-between"}>

                    <MessageList setUnreadMessagesCount={setUnreadMessagesCount}
                                 unreadMessagesCount={unreadMessagesCount}
                                 chat={chat}
                                 messages={messages}
                                 saveLastReadMessageId={saveLastReadMessageId}
                                 lastReadMessageId={lastReadMessageId}
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
                />
            </Flex>
        </Flex>
    );
};

export default ChatWindow;