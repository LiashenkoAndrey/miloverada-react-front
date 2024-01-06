import React, {FC, useCallback, useEffect, useState} from 'react';
import {Button, Flex, Input, Tooltip} from "antd";
import {FileAddOutlined, FileImageOutlined, GlobalOutlined, RightOutlined} from "@ant-design/icons";
import {useAuth0} from "@auth0/auth0-react";
import {ForumUserDto} from "../../../API/services/forum/ForumInterfaces";
import {Client} from "@stomp/stompjs";
import {MessageDto} from "../../../API/services/forum/MessageDto";

interface ChatInputProps {
    stompClient? : Client
    chatId : number
    filterTypingUsers ( userId: string | undefined) : void
    input : string
    setInput :  React.Dispatch<React.SetStateAction<string>>
}

const ChatInput: FC<ChatInputProps> = ({
                                           stompClient,
                                           chatId,
                                           filterTypingUsers, input, setInput
                                       }) => {

    const {isAuthenticated, user} = useAuth0()
    const [isTyping, setIsTyping] = useState<boolean>();

    const onStopTyping = () => {
        notifyThatUserStoppedTyping()
        setIsTyping(false)
    }

    const handleEvent = (e: any) => {
        if (!isTyping) setIsTyping(true)
        setInput(e.target.value)
    }

    useEffect(() => {
        if (isTyping !== undefined) {
            if (isTyping) {
                notifyThatUserStartedTyping()
            } else if (user?.sub) {
                filterTypingUsers(user.sub)
            }
        }
    }, [isTyping]);


    const getForumUser = () : ForumUserDto => {
        if ( user?.name && user.sub) {
            return  {
                name: user.name,
                id: user.sub,
                chatId: chatId
            }
        } throw new Error("user data is undefined, perhaps not auth")
    }


    useEffect(() => {
        if (input !== '') {
            const delayDebounceFn = setTimeout(onStopTyping, 3000)
            return () => clearTimeout(delayDebounceFn)
        }
    }, [input]);

    const onSend = useCallback(async () => {
        if (input !== '' && input.length < 3000) {
            if(stompClient && user?.sub) {

                const messageDto : MessageDto  = {
                    senderId : user.sub,
                    text: input,
                    chatId: chatId,
                }
                const body = JSON.stringify(messageDto)

                console.log("new msg", messageDto)
                stompClient.publish({
                    destination: '/app/userMessage/new', body: body,
                    headers: {
                        'content-type': 'application/json'
                    }}
                )
                filterTypingUsers(user?.sub)
                onStopTyping()
                setInput('')
            } else console.error("stompClient is null")
        } else console.error("validation error")
    }, [chatId, input, stompClient, user]);


    const notifyThatUserStoppedTyping = () => {
        if (isAuthenticated && stompClient)  {
            const body = JSON.stringify(getForumUser())
            stompClient.publish({
                destination: '/app/user/stopTyping', body: body,
                headers: {
                    'content-type': 'application/json'
                }}
            )
        } else console.info("notifyThatUserStoppedTyping: stompClient is undefined or not auth", stompClient !== undefined, isAuthenticated)
    }

    const notifyThatUserStartedTyping = () => {
        if (isAuthenticated && stompClient !== undefined) {
            const body = JSON.stringify(getForumUser())
            stompClient.publish({
                destination: '/app/user/startTyping', body: body,
                headers: {
                    'content-type': 'application/json'
                }}
            )
        } console.info("notifyThatUserStartedTyping: stompClient is undefined or not auth", stompClient !== undefined, isAuthenticated)
    }

    return (
        <Flex style={{alignSelf: "flex-end", width: "100%", padding: 3, backgroundColor: "rgba(255,255,255,0)"}}>
            <Tooltip title={isAuthenticated ? "" : "Спочатку авторизуйтеся"}>
                <Input disabled={!isAuthenticated} placeholder={"Ваше повідолення...."} value={input} onChange={handleEvent}/>
            </Tooltip>
            <Flex style={{margin: "0 5px"}} gap={3}>
                <Button disabled={!isAuthenticated}  icon={<FileAddOutlined  style={{fontSize: 22}}  />}/>
                <Button disabled={!isAuthenticated}  icon={<FileImageOutlined style={{fontSize: 22}} />}/>
                <Button disabled={!isAuthenticated} icon={<GlobalOutlined style={{fontSize: 22}} />}/>
            </Flex>
            <Button disabled={!isAuthenticated} onClick={onSend} type={"primary"} icon={<RightOutlined />}>Відправити</Button>
        </Flex>
    );
};

export default ChatInput;