import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {Empty, Flex} from "antd";
import {Chat, Message} from "../../../API/services/forum/ForumInterfaces";
import MessageListItem from "../../../pages/forum/Message/MessageListItem";
import {useAuth0} from "@auth0/auth0-react";
import classes from './MessageList.module.css'
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {compose} from "redux";
import {useActions} from "../../../hooks/useActions";

interface MessageListProps {
    chat?: Chat,
    unreadMessagesCount? : number
    setUnreadMessagesCount : React.Dispatch<React.SetStateAction<number | undefined>>
    saveLastReadMessageId(messageId: number): void
    lastReadMessageId? : number
    onEditMessage : (message : Message) => void
    editMessage? : Message
    onReplyMessage : (message : Message) => void
    replyMessage? : Message
    onDeleteMessage : (messageId : number) => void
}

const MessageList: FC<MessageListProps> = ({
                                               chat,
                                               setUnreadMessagesCount,
                                               unreadMessagesCount,
                                               saveLastReadMessageId,
                                               lastReadMessageId,
                                               onEditMessage,
                                               editMessage,
                                               onReplyMessage,
                                               replyMessage,
                                               onDeleteMessage
                                           }) => {

    const readMessagesObserver = useRef<IntersectionObserver>()
    const {isAuthenticated} = useAuth0()
    const {messages, chatId, hasPreviousMessages} = useTypedSelector(state => state.chat)
    const [newSeenMessageId, setNewSeenMessageId] = useState<number>()
    const [oldSeenMsgID, setOldSeenMsgID] = useState<number>()

    useEffect(() => {
        if (newSeenMessageId === undefined) {
            setNewSeenMessageId(oldSeenMsgID)
        } else {
            if (oldSeenMsgID !== undefined) {
                if (newSeenMessageId < oldSeenMsgID) {
                    setNewSeenMessageId(oldSeenMsgID)
                }
            }
        }
    }, [oldSeenMsgID]);

    const callBack: IntersectionObserverCallback = (entries, observer) => {
        const element = entries[0]
        if (element.isIntersecting) {
            const elemId = element.target.getAttribute("id");
            if (elemId) {
                const messageId = Number(elemId.split("-")[1])
                // console.log("seen message", element)
                setOldSeenMsgID(messageId)

            } else throw new Error("")
        } else {
            observer.unobserve(element.target)
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            readMessagesObserver.current = new IntersectionObserver(callBack)
        }
    }, []);

    const decrementCount = useCallback(() => {
        if (unreadMessagesCount) {
            console.log("decrement count")
            setUnreadMessagesCount(unreadMessagesCount - 1)
        } else console.log("ERROR CANT DECREMENT")
    }, [setUnreadMessagesCount, unreadMessagesCount]);
    
    useEffect(() => {
        if (isAuthenticated) {

            if (newSeenMessageId) {
                if (lastReadMessageId) {
                    if (newSeenMessageId > lastReadMessageId) {
                        decrementCount()
                        const delayFunc = setTimeout(() => {
                            // console.log("last seen message is", newSeenMessageId)
                            saveLastReadMessageId(newSeenMessageId)

                        }, 1500)
                        return () => clearTimeout(delayFunc)
                    } else {
                        // console.log("one of contition is false: ", user?.sub, "stompClient", (newSeenMessageId > lastReadMessageId))
                    }
                } else {
                    decrementCount()
                    const delayFunc = setTimeout(() => {
                        // console.log("last seen message is", newSeenMessageId)
                        saveLastReadMessageId(newSeenMessageId)

                    }, 1500)
                    return () => clearTimeout(delayFunc)
                }
            } else {
                // console.log("newSeenMessageId is passed to save, but it is undefined!")
            }
        }
    }, [newSeenMessageId]);

    const {fetchPreviousMessages} = useActions()




    const intersectionCallback : IntersectionObserverCallback = (entries, observer) => {
        console.log("intersectionCallback".toUpperCase())
        const element = entries[0]
        if (element.isIntersecting) {
            fetchPreviousMessages(chatId, messages)
            observer.unobserve(element.target)
        }
    };

    const loadPreviousMessagesObserver = new IntersectionObserver(intersectionCallback);
    const [loadTopTriggerMessageId, setLoadTopTriggerMessageId] = useState<number>(5)

    useEffect(() => {
        if (hasPreviousMessages) {
            console.log(messages, "update!")
            setTimeout(() => {
                if (messages.length > 0) {
                    console.log("observerTargetMessage index" ,Math.round((messages.length / 2) / 2), messages)
                    const observerTargetMessage = messages[Math.round((messages.length / 2) / 2)].id;
                    let target = document.getElementById("msgId-" + observerTargetMessage)
                    console.log("target", target)
                    if (target) {
                        loadPreviousMessagesObserver.observe(target)
                    }
                }
            }, 300)
        }

        return () => loadPreviousMessagesObserver.disconnect()
    }, [messages]);


    return (
        <Flex id={"msgWrapper"} className={classes.messagesWrapper} vertical={true}>
            {messages.length > 0
                ?
                messages.map((msg) =>
                        <MessageListItem
                            loadPreviousMessagesObserver={loadPreviousMessagesObserver}
                            loadTopTriggerMessageId={loadTopTriggerMessageId}
                            onDeleteMessage={onDeleteMessage}
                            onEditMessage={onEditMessage}
                            replyMessage={replyMessage}
                            onReplyMessage={onReplyMessage}
                            chat={chat}
                            observer={readMessagesObserver.current}
                            key={"msg-" + msg.id}
                            message={msg}
                            editMessage={editMessage}
                        />
                )
                :
                <Empty style={{marginTop: "5vh"}} description={"Поки немає обрговорень. Почніть першим)!"}/>
            }

            <div style={{float: "left", clear: "both"}} id={"chatBottom"}></div>
        </Flex>
    );
};

export default MessageList;