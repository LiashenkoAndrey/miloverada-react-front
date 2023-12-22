import React, {FC, useEffect, useState} from 'react';
import {Flex} from "antd";
import {Chat, Message, User} from "../../API/services/forum/ForumInterfaces";
import {useStompClient, useSubscription} from "react-stomp-hooks";
import {MessageDto} from "../../API/services/forum/MessageDto";
import MessageList from "./MessageList/MessageList";
import ChatInput from "./ChatInput/ChatInput";
import ChatHeader from "./ChatHeader/ChatHeader";

interface ChatProps {
    chat? : Chat
    messages : Array<Message>,
    setMessages : Function,
    chatId : number,
    typingUsers : Array<User>,
    setTypingUsers : React.Dispatch<React.SetStateAction<User[]>>,
    setChat : React.Dispatch<React.SetStateAction<Chat | undefined>>
}

const ChatWindow: FC<ChatProps> = ({messages, setMessages, chatId, chat, typingUsers, setTypingUsers, setChat}) => {

    const [input, setInput] = useState<string>('');
    const destination = `/chat/` + chatId;


    useSubscription(destination, (message) => {
        const data = JSON.parse( message.body)
        console.log("new message", JSON.parse( message.body))
        setInput('')
        let msg = messages === undefined ? [] : messages;
        if (chat !== undefined) {
            console.log("increment")
            chat.totalMessagesAmount  = chat?.totalMessagesAmount + 1;
        }
        setMessages([...msg, data])
    });
    const stompClient = useStompClient();


    const onSend = async () => {
        if (input !== '' && input.length < 3000) {
            if(stompClient) {

                console.log("send message: chatId:" + chatId)
                const messageDto : MessageDto  = {
                    senderId : 1,
                    text: input,
                    chatId: chatId
                }

                const body = JSON.stringify(messageDto)

                stompClient.publish({
                    destination: '/app/userMessage/new', body: body,
                    headers: {
                    'content-type': 'application/json'
                    }}
                )
            }
        }
    }

    const [isTyping, setIsTyping] = useState<boolean>();

    useEffect(() => {
        if (input !== '') {
            const delayDebounceFn = setTimeout(() => {
                console.log(input, "stop typing.")

                setIsTyping(false)
            }, 3000)
            return () => clearTimeout(delayDebounceFn)
        }
    }, [input]);

    useEffect(() => {
        if (isTyping !== undefined) {
            if (isTyping) {
                const arr =[...typingUsers, {name :"Andrew Liashenko", id: 1}]
                setTypingUsers(arr)
                console.log("isTyping", isTyping, arr)
            } else {
                const filtered = typingUsers.filter((user) => user.id !== 1)
                setTypingUsers(filtered)
            }
        }
    }, [isTyping]);

    const handleEvent = (e: any) => {
        if (!isTyping) setIsTyping(true)
        setInput(e.target.value)
    }

    return (
        <Flex vertical={true}>
            <ChatHeader typingUsers={typingUsers} chat={chat}/>

            <Flex vertical={true} className={"chat"} justify={"space-between"}>
                <MessageList messages={messages}/>
                <ChatInput input={input} handleEvent={handleEvent} onSend={onSend}/>
            </Flex>
        </Flex>
    );
};

export default ChatWindow;