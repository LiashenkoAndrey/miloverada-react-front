import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {Button, Flex, Image, Input, Tooltip, Upload} from "antd";
import {
    CloseCircleOutlined,
    FileAddOutlined,
    FileImageOutlined,
    GlobalOutlined, PlusOutlined,
    RightOutlined
} from "@ant-design/icons";
import {useAuth0} from "@auth0/auth0-react";
import {ForumUserDto, MessageImageDto} from "../../../API/services/forum/ForumInterfaces";
import {Client} from "@stomp/stompjs";
import {MessageDto} from "../../../API/services/forum/MessageDto";
import './ChatInput.css'
import {RcFile} from "antd/es/upload";
import ImageUpload from "../ImageUpload/ImageUpload";

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

    const [fileList, setFileList] = useState<string[]>([]);

    const onSend = useCallback(async () => {
        if (input !== '' && input.length < 3000) {
            if(stompClient && user?.sub) {

                const messageDto : MessageDto  = {
                    senderId : user.sub,
                    text: input,
                    chatId: chatId,
                    imagesDtoList : fileList.map((file) => {
                        return {
                            base64Image : file
                        }
                    })
                }
                const body = JSON.stringify(messageDto)

                console.log("new msg", messageDto)
                stompClient.publish({
                    destination: '/app/userMessage/new',
                    body: body,
                    headers: {
                        'content-type': 'application/json'
                    }}
                )
                filterTypingUsers(user?.sub)
                onStopTyping()
                setFileList([])
                setIsImageUploadActive(false)
                setInput('')
            } else console.error("stompClient is null")
        } else console.error("validation error")
    }, [chatId, input, stompClient, user, fileList]);


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


    const [isImageUploadActive, setIsImageUploadActive] = useState<boolean>(false)




    const openImageUpload = () => {
        setIsImageUploadActive(true)
    }



    const onImageUploadClose = () => {
        setIsImageUploadActive(false)
        setFileList([])
    }

    return (
        <Flex vertical>
            <ImageUpload fileList={fileList}
                         setFileList={setFileList}
                         isImageUploadActive={isImageUploadActive}
                         onImageUploadClose={onImageUploadClose}
            />
            <Flex style={{alignSelf: "flex-end", width: "100%", padding: 3, backgroundColor: "rgba(255,255,255,0)"}}>

                <Tooltip title={isAuthenticated ? "" : "Спочатку авторизуйтеся"}>
                    <Input disabled={!isAuthenticated} placeholder={"Ваше повідолення...."} value={input} onChange={handleEvent}/>
                </Tooltip>
                <Flex style={{margin: "0 5px"}} gap={3}>
                    <Button disabled={!isAuthenticated}  icon={<FileAddOutlined  style={{fontSize: 22}}  />}/>
                    <Button onClick={openImageUpload} disabled={!isAuthenticated} icon={<FileImageOutlined style={{fontSize: 22}} />}/>
                    <Button disabled={!isAuthenticated} icon={<GlobalOutlined style={{fontSize: 22}} />}/>
                </Flex>
                <Button disabled={!isAuthenticated} onClick={onSend} type={"primary"} icon={<RightOutlined />}>Відправити</Button>
            </Flex>
        </Flex>

    );
};

export default ChatInput;