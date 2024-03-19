import React, {FC, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {App, Button, Flex, Tooltip} from "antd";
import {FileAddOutlined, FileImageOutlined, GlobalOutlined, RightOutlined} from "@ant-design/icons";
import {useAuth0} from "@auth0/auth0-react";
import {ForumUserDto, Message, UpdateMessageDto} from "../../../API/services/forum/ForumInterfaces";
import {Client} from "@stomp/stompjs";
import {MessageDto, MessageFileDtoSmall, MessageIsSavedPayload} from "../../../API/services/forum/MessageDto";
import './ChatInput.css'
import ImageUpload from "../ImageUpload/ImageUpload";
import EditMessage from "../EditMessage/EditMessage";
import TextareaAutosize from 'react-textarea-autosize';
import {AuthContext} from "../../../context/AuthContext";
import {publishNewMessage, updateMessage} from "../../../API/services/forum/MessageService";
import ReplyToMessage from "../ReplyToMessage/ReplyToMessage";
import {imageToDto} from "../../../API/services/ImageService";
import FileUpload from "../FileUpload/FileUpload";
import {IMessage} from "@stomp/stompjs/src/i-message";
import {fileToDto, saveMessageFile} from "../../../API/services/forum/MessageFileService";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {useSubscription} from "react-stomp-hooks";

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

    const {filesList} = useTypedSelector(state => state.chatInput)

    const {notification} = App.useApp();
    const [imageList, setImageList] = useState<string[]>([]);
    const [isImageUploadActive, setIsImageUploadActive] = useState<boolean>(false)
    const [isFileUploadActive, setIsFileUploadActive] = useState<boolean>(false)


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
        } throw new Error("user data is undefined, maybe not auth")
    }


    useEffect(() => {
        if (input !== '') {
            const delayDebounceFn = setTimeout(onStopTyping, 3000)
            return () => clearTimeout(delayDebounceFn)
        }
    }, [input]);

    const onMessageIsSaved = async (message : IMessage) => {
        const payload : MessageIsSavedPayload = JSON.parse(message.body)
        console.log("onMessageIsSaved".toUpperCase(), payload)
        console.log("files list", filesList)
        if (jwt) {

            for (let i = 0; i < filesList.length; i++) {
                const file = filesList[i]
                console.log("Save file", file)
                await saveMessageFile(file, payload.messageId, chatId, jwt)
            }

        } else console.log("jwt null")
    }

    useSubscription(`/chat/` + chatId + "/messageIsSaved?senderId=" + user?.sub, onMessageIsSaved)


    const onSend = () => {
        if (input !== '' && input.length < 3000) {
            if(stompClient && user?.sub) {
                console.log("after fileToDto", filesList)
                const fileDtoList: MessageFileDtoSmall[] = fileToDto(filesList)
                console.log("fileDtoList", fileDtoList)

                const messageDto : MessageDto  = {
                    senderId : user.sub,
                    text: input,
                    chatId: chatId,
                    imagesDtoList : imageToDto(imageList),
                    replyToMessageId: replyMessage?.id,
                    fileDtoList : fileDtoList
                }

                publishNewMessage(stompClient, messageDto)

                setEditMessage(undefined)
                setReplyMessage(undefined)
                filterTypingUsers(user?.sub)
                onStopTyping()
                setImageList([])
                setIsImageUploadActive(false)
                setInput('')
            } else console.error("stompClient or user id is null")
        } else console.error("validation error")
    };



    const updateMsg = useCallback( async () => {

        if(stompClient && user?.sub && editMessage?.id && jwt) {
            const messageDto : UpdateMessageDto  = {
                id : editMessage.id,
                text: input,
                chatId: chatId,
            }

            const {data, error} = await updateMessage(messageDto, jwt)
            if (data) {
                setEditMessage(undefined)
                setInput('')
            }
            if (error) {
                notification.error({message: "can't update message"})
                throw error
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
        } else console.info(
            "notifyThatUserStoppedTyping: stompClient is undefined or not auth",
            stompClient !== undefined,
            isAuthenticated
        )
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
        } console.info(
            "notifyThatUserStartedTyping: stompClient is undefined or not auth",
            stompClient !== undefined,
            isAuthenticated
        )
    }


    const openImageUpload = () => {
        setIsImageUploadActive(true)
    }

    const openFileUpload = () => {
        setIsFileUploadActive(true)
    }

    const onImageUploadClose = () => {
        setIsImageUploadActive(false)
        setImageList([])
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
            <FileUpload
                isFileUploadActive={isFileUploadActive}
                setIsFileUploadActive={setIsFileUploadActive}
            />

            <ImageUpload imageList={imageList}
                         setFileList={setImageList}
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
                setImageList={setImageList}
                replyMessage={replyMessage}
                setReplyMessage={setReplyMessage}
            />

            <Flex className={"chatInput"}>

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
                    <Flex style={{height: "100%"}}>
                        <Button className={"toolBtn"} onClick={openFileUpload}
                                disabled={isBtnsActive()}
                                icon={<FileAddOutlined style={{fontSize: 25}}/>}
                        />
                        <Button className={"toolBtn"} onClick={openImageUpload}
                                disabled={isBtnsActive()}
                                icon={<FileImageOutlined style={{fontSize: 25}}/>}
                        />
                        <Button className={"toolBtn"}
                                disabled={isBtnsActive()}
                                icon={<GlobalOutlined style={{fontSize: 25}}/>}
                        />
                    </Flex>
                    <Button style={{border: "none", }}
                            disabled={!isAuthenticated}
                            onClick={() => editMessage !== undefined ? updateMsg() : onSend()}
                            type={"primary"} className={[btnClass, "chatSubmitBtn"].join(' ')} icon={<RightOutlined/>}
                    >
                        {btnText}
                    </Button>
                </Flex>
            </Flex>
        </Flex>

    );
};

export default ChatInput;