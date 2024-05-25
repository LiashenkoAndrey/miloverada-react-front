import React, {FC, useCallback, useContext, useEffect, useRef, useState} from 'react';
import {App, Badge, Flex} from "antd";
import {
    ChatMetadata,
    DeleteMessageDto,
    DeleteMessageImageDto,
    LastReadMessageDto,
    Message,
    TypingUser,
    UpdateMessageDto
} from "../../API/services/forum/ForumInterfaces";
import {useStompClient, useSubscription} from "react-stomp-hooks";
import MessageList from "./MessageList/MessageList";
import ChatInput from "./ChatInput/ChatInput";
import ChatHeader from "./ChatHeader/ChatHeader";
import {IMessage} from "@stomp/stompjs/src/i-message";
import {useAuth0} from "@auth0/auth0-react";
import {DownOutlined} from "@ant-design/icons";
import {deleteMessageById, getLatestMessagesOfChat} from "../../API/services/forum/MessageService";
import {AuthContext} from "../../context/AuthContext";
import chat_classes from './ChatWindow.module.css'
import {useActions} from "../../hooks/useActions";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {isMyMessage} from "../../API/services/forum/UserService";
import {MessageFileDto} from "../../API/services/forum/MessageDto";
import {getChatMetadata, getMessagesByChatIdAndLastReadMessage} from "../../API/services/forum/ChatService";
import {MESSAGE_LOAD_PORTION_SIZE, MESSAGES_LIST_DEFAULT_SIZE} from "../../Constants";
// @ts-ignore
import refrenceArrowIconBlack from "../../assets/back-arrow-svgrepo-com.svg";
import SelectionToolbar from "../forum/SelectionToolbar/SelectionToolbar";
import SelectChatModalToForwardMessages
    from "../forum/SelectChatModalToForwradMessages/SelectChatModalToForwardMessages";

interface ChatProps {
}

const ChatWindow: FC<ChatProps> = () => {

    const {messages, unreadMessagesCount, chatId, chatInfo, isSelectionEnabled} = useTypedSelector(state => state.chat)
    const {setMsg, setUnreadMessagesCount, setHasPreviousMessages, setHasNextMessages, setLastReadMessageId} = useActions()
    const stompClient = useStompClient()
    const {user, isAuthenticated} = useAuth0()
    const lastMessageObserver = useRef<IntersectionObserver>()
    const [isScrollDownButtonActive, setIsScrollDownButtonActive] = useState<boolean>(false)
    const [input, setInput] = useState<string>('');
    const {jwt} = useContext(AuthContext)
    const {notification} = App.useApp();
    const [isNeedScrollToBottom, setIsNeedScrollToBottom] = useState<boolean>(false)
    const [typingUsers, setTypingUsers] = useState<Array<TypingUser>>([]);


    useEffect(() => {
        if (chatId > 0) {
            if (isAuthenticated) {
                getMetadataAndLoadMessages(chatId)
            } else {
                getLatestOfChat()
            }
        }
    }, [chatId]);


    const getLatestOfChat = async () => {
        const {data, error} = await getLatestMessagesOfChat(chatId)
        if (data) {
            setMsg(data)
            setTimeout(() => {
                scrollToChatBottom()
            }, 100)
        }
        if (error) throw error;
    }


    const getMetadataAndLoadMessages = async (chatId: number) => {
        if (user?.sub) {
            const chatMetadata = await getChatMetadata(chatId, encodeURIComponent(user.sub))
            if (chatMetadata.data) {
                const metadata: ChatMetadata = chatMetadata.data
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

                const {data, error} = await getMessagesByChatIdAndLastReadMessage(Number(chatId), 0, MESSAGE_LOAD_PORTION_SIZE * 2, metadata.last_read_message_id);
                if (data) {
                    if (data.length < MESSAGES_LIST_DEFAULT_SIZE) {
                        setHasNextMessages(false)
                        setHasPreviousMessages(false)
                    }
                    setMsg(data)

                    setTimeout(() => {
                        const lastReadMsg = document.getElementById(`msgId-${metadata.last_read_message_id}`)
                        lastReadMsg?.scrollIntoView({behavior: "auto", block: 'end'});
                    }, 100)

                }
                if (error) throw error;

            }
            if (chatMetadata.error) throw chatMetadata.error
        }
    }


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
        let foundMsg = messages.filter((message) => message.id === dto.messageId)[0]
        let msgIndex = messages.indexOf(foundMsg)
        let list = foundMsg.fileDtoList;
        let fileArr = list.filter((fileDto) => fileDto.name === dto.name)
        let file = fileArr[0]

        let index = list.indexOf(file)

        file.mongoId = dto.mongoId
        file.isLarge = dto.isLarge
        file.messageId = dto.messageId

        list[index] = file;
        foundMsg.fileDtoList = list
        messages[msgIndex] = foundMsg
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


    function scrollToLastMessage() {
        setTimeout(() => {
            if (messages.length > 0) {
                const lastMessage = document.getElementById("msgId-" + messages[messages.length-1].id)
                lastMessage?.scrollIntoView({behavior: "smooth", block: 'center'});
            }
        }, 5)
    }

    const scrollToChatBottom = () => {
        const chatBottom = document.getElementById("chatBottom")
        chatBottom?.scrollIntoView({behavior: "smooth", block: 'nearest'});
    }

    const onChatMessagesSubscribe = (message: IMessage) => {
        const data : Message = JSON.parse(message.body)
        if (isMyMessage(data.sender.id, user?.sub) || isNeedScrollToBottom) {
            scrollToLastMessage()
        }

        // setInput('')
        if (chatInfo !== null) {
            chatInfo.totalMessagesAmount  = chatInfo?.totalMessagesAmount + 1;
        }
        setMsg([...messages, data])
    }

    const onForwardMessagesEvent = (dto: IMessage) => {
        const forwardedMessages : Message[] = JSON.parse(dto.body)
        console.log("forwardedMessagesEvent", forwardedMessages)
        if (chatInfo !== null) {
            chatInfo.totalMessagesAmount  = chatInfo?.totalMessagesAmount + forwardedMessages.length;
        }
        setMsg([...messages, ...forwardedMessages])
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
    useSubscription(`/chat/${chatId}/newForwardedMessagesEvent`, onForwardMessagesEvent)

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
        if (stompClient && chatInfo?.id) {
            const body : DeleteMessageDto = {
                messageId : messageId,
                chatId : chatInfo?.id
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
        <Flex style={{zIndex: 2}} className={chat_classes.chatWindow} justify={"space-between"} vertical={true}>
            <ChatHeader typingUsers={typingUsers}
                        chatId={chatId}
                        setTypingUsers={setTypingUsers}
                        filterTypingUsers={filterTypingUsers}
            />
            <Flex style={{backgroundColor: "black", overflowY: "hidden", flexGrow: 1}}>
                <Flex vertical={true} className={chat_classes.chat} justify={"space-between"}>
                    <MessageList
                        saveLastReadMessageId={saveLastReadMessageId}
                        onEditMessage={onEditMessage}
                        editMessage={editMessage}
                        onReplyMessage={onReplyMessage}
                        replyMessage={replyMessage}
                        onDeleteMessage={onDeleteMessage}
                    />

                    <SelectionToolbar onDeleteMessage={onDeleteMessage}/>

                    <SelectChatModalToForwardMessages/>

                    <Flex style={{display: isScrollDownButtonActive ? "flex" : "none"}} onClick={toBottom}
                          className={"unreadMessagesFloatButtonWrapper"}>
                        <Badge count={unreadMessagesCount} color={"#8f4c58"}>
                            <DownOutlined className={"unreadMessagesFloatButton"}/>
                        </Badge>
                    </Flex>
                </Flex>
            </Flex>
            <div
                 className={chat_classes.chatBottomWrapper}
            >
                {(isSelectionEnabled || isAuthenticated) &&
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
                }

            </div>

        </Flex>
    );
};

export default ChatWindow;
