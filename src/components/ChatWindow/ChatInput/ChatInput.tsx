import React, {FC, Ref, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {App, Button, Flex, Input, Tooltip} from "antd";
import {FileAddOutlined, FileImageOutlined, GlobalOutlined, RightOutlined} from "@ant-design/icons";
import {useAuth0} from "@auth0/auth0-react";
import {ForumUserDto, Message, UpdateMessageDto} from "../../../API/services/forum/ForumInterfaces";
import {Client} from "@stomp/stompjs";
import {MessageDto} from "../../../API/services/forum/MessageDto";
import './ChatInput.css'
import ImageUpload from "../ImageUpload/ImageUpload";
import EditMessage from "../EditMessage/EditMessage";
import TextareaAutosize from 'react-textarea-autosize';
import {AuthContext} from "../../../context/AuthContext";
import {updateMessage} from "../../../API/services/forum/MessageService";
import ReplyToMessage from "../ReplyToMessage/ReplyToMessage";

interface ChatInputProps {
    stompClient? : Client
    chatId : number
    filterTypingUsers ( userId: string | undefined) : void
    input : string
    setInput :  React.Dispatch<React.SetStateAction<string>>
    setEditMessage :  React.Dispatch<React.SetStateAction<Message | undefined>>
    editMessage? : Message
    setReplyMessage : React.Dispatch<React.SetStateAction<Message | undefined>>
    replyMessage? : Message
}


const ChatInput: FC<ChatInputProps> = ({
                                           setEditMessage,
                                           editMessage,
                                           stompClient,
                                           chatId,
                                           filterTypingUsers,
                                           input,
                                           setInput,
                                           replyMessage,
                                           setReplyMessage
                                       }) => {

    const {isAuthenticated, user} = useAuth0()
    const [isTyping, setIsTyping] = useState<boolean>();
    const {jwt} = useContext(AuthContext)
    const {notification} = App.useApp();
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
                    }),
                    replyToMessageId: replyMessage?.id
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
                setEditMessage(undefined)
                filterTypingUsers(user?.sub)
                onStopTyping()
                setFileList([])
                setIsImageUploadActive(false)
                setInput('')
            } else console.error("stompClient or user id is null")
        } else console.error("validation error")
    }, [chatId, input, stompClient, user, fileList]);


    const updateMsg = useCallback( async () => {
        console.log("update", input)
        if(stompClient && user?.sub && editMessage?.id && jwt) {

            const messageDto : UpdateMessageDto  = {
                id : editMessage.id,
                text: input,
                chatId: chatId,
            }

            console.log("edit msg", messageDto)

            const {data, error} = await updateMessage(messageDto, jwt)
            if (data) {
                setEditMessage(undefined)
                setInput('')
            }
            if (error) {
                throw error
                notification.error({message: "can't update message"})
            }

        } else console.error("Error update")
    }, [input]);

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

    const [btnClass, setBtnClass] = useState<string>("")
    const [btnText, setBtnText] = useState<string>("Відправити")

    useEffect(() => {
        if (editMessage !== undefined) {
            setBtnClass("editBtn")
            setBtnText("Редагувати")
            return;
        }
        if (replyMessage !== undefined) {
            setBtnClass("replyBtn")
            setBtnText("Відповісти")
            return
        }
        setBtnClass("sendBtn")
        setBtnText("Відправити")

    }, [editMessage, replyMessage]);


    const isBtnsActive = useCallback(() => {
        return !isAuthenticated || editMessage !== undefined
    }, [editMessage, isAuthenticated]);


    const inputRef = useRef<HTMLTextAreaElement | null>(null)

    return (
        <Flex vertical>
            <ImageUpload fileList={fileList}
                         setFileList={setFileList}
                         isImageUploadActive={isImageUploadActive}
                         onImageUploadClose={onImageUploadClose}
            />
            <EditMessage
                inputRef={inputRef}
                setInput={setInput}
                editMessage={editMessage}
                setEditMessage={setEditMessage}
            />
            <ReplyToMessage
                inputRef={inputRef}
                setFileList={setFileList}
                replyMessage={replyMessage}
                setReplyMessage={setReplyMessage}
            />

            <Flex style={{alignSelf: "flex-end", width: "100%", padding: 3, backgroundColor: "rgba(255,255,255,0.1)"}}>

                <Tooltip title={isAuthenticated ? "" : "Спочатку авторизуйтеся"}>
                    <TextareaAutosize maxRows={10}
                                      ref={inputRef}
                                      style={{width: "100%", boxSizing: "border-box"}}
                                      className={"input"}
                                      maxLength={3000}
                                      hidden={!isAuthenticated}
                                      placeholder={"Ваше повідолення...."}
                                      value={input}
                                      onChange={handleEvent}
                    />
                </Tooltip>
                <Flex align={"flex-end"}>
                    <Flex style={{margin: "0 5px"}} gap={3}>
                        <Button className={"toolBtn"}  disabled={isBtnsActive()}  icon={<FileAddOutlined  style={{fontSize: 22}}  />}/>
                        <Button className={"toolBtn"} onClick={openImageUpload} disabled={isBtnsActive()} icon={<FileImageOutlined style={{fontSize: 22}} />}/>
                        <Button className={"toolBtn"} disabled={isBtnsActive()} icon={<GlobalOutlined style={{fontSize: 22}} />}/>
                    </Flex>
                    <Button disabled={!isAuthenticated} onClick={() => editMessage !== undefined ? updateMsg() : onSend()} type={"primary"} className={btnClass} icon={<RightOutlined />}>{btnText}</Button>
                </Flex>
            </Flex>
        </Flex>

    );
};

export default ChatInput;