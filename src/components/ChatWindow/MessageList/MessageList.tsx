import React, {FC, useEffect, useRef, useState} from 'react';
import {Empty, Flex} from "antd";
import {IChat, Message} from "../../../API/services/forum/ForumInterfaces";
import MessageListItem from "../../../pages/forum/Message/MessageListItem";
import {useAuth0} from "@auth0/auth0-react";
import classes from './MessageList.module.css'
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {useActions} from "../../../hooks/useActions";
import {
    getIndexOfMessage,
    observeNextMessagesLoadingTrigger,
    observePreviousMessagesLoadingTrigger
} from "../../../API/services/forum/MessageService";
// @ts-ignore
import helloGif from '../../../assets/hello.gif'

interface MessageListProps {
    saveLastReadMessageId(messageId: number): void
    onEditMessage : (message : Message) => void
    editMessage? : Message
    onReplyMessage : (message : Message) => void
    replyMessage? : Message
    onDeleteMessage : (messageId : number) => void
}

const MessageList: FC<MessageListProps> = ({
                                               saveLastReadMessageId,
                                               onEditMessage,
                                               editMessage,
                                               onReplyMessage,
                                               replyMessage,
                                               onDeleteMessage
                                           }) => {

    const {isAuthenticated} = useAuth0()
    const {messages, chatId, hasPreviousMessages, hasNextMessages, unreadMessagesCount, lastReadMessageId} = useTypedSelector(state => state.chat)
    const [newSeenMessageId, setNewSeenMessageId] = useState<number>()
    const [oldSeenMsgID, setOldSeenMsgID] = useState<number>()
    const {fetchPreviousMessages, fetchNextMessages, setUnreadMessagesCount, setLastReadMessageId} = useActions()

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

    const onNewMessageSeen: IntersectionObserverCallback = (entries, observer) => {
        const element = entries[0]
        if (element.isIntersecting) {
            const elemId = element.target.getAttribute("id");
            if (elemId) {
                const messageId = Number(elemId.split("-")[1])
                setOldSeenMsgID(messageId)

            } else throw new Error("")
        } else {
            observer.unobserve(element.target)
        }
    }
    const readMessagesObserver = new IntersectionObserver(onNewMessageSeen)



    const decrementCount = () => {
        if (unreadMessagesCount) {
            const lastReadMessageIdIndex = getIndexOfMessage(lastReadMessageId)
            const newLastReadMessageIdIndex = getIndexOfMessage(newSeenMessageId)
            const difference = newLastReadMessageIdIndex - lastReadMessageIdIndex;
            setUnreadMessagesCount(Math.abs(unreadMessagesCount - difference))
        }
    }


    useEffect(() => {
        if (isAuthenticated && newSeenMessageId) {
            if (lastReadMessageId) {
                if (newSeenMessageId <= lastReadMessageId) return;
            }

            decrementCount()
            setLastReadMessageId(newSeenMessageId)
            const delayFunc = setTimeout(() => {
                saveLastReadMessageId(newSeenMessageId)
            }, 1500)
            return () => clearTimeout(delayFunc)
        }
    }, [newSeenMessageId]);


    const loadPreviousMessagesObserverCallback : IntersectionObserverCallback = (entries, observer) => {
        const element = entries[0]
        if (element.isIntersecting) {
            fetchPreviousMessages(chatId, messages)
            observer.unobserve(element.target)
        }
    };

    const loadNextMessagesObserverCallback : IntersectionObserverCallback = (entries, observer) => {
        const element = entries[0]
        if (element.isIntersecting) {
            fetchNextMessages(chatId, messages)
            observer.unobserve(element.target)
        }
    };

    const loadPreviousMessagesObserver = new IntersectionObserver(loadPreviousMessagesObserverCallback);
    const loadNextMessagesObserver = new IntersectionObserver(loadNextMessagesObserverCallback);

    useEffect(() => {
        if (hasPreviousMessages) {
            setTimeout(() => {
                observePreviousMessagesLoadingTrigger(loadPreviousMessagesObserver, messages)
            }, 1500)
        }
        return () => loadPreviousMessagesObserver.disconnect()
    }, [messages]);


    useEffect(() => {
        if (hasNextMessages) {
            setTimeout(() => {
                observeNextMessagesLoadingTrigger(loadNextMessagesObserver, messages)
            }, 1500)
        }
        return () => loadNextMessagesObserver.disconnect()
    }, [messages]);


    return (
        <Flex id={"msgWrapper"} className={classes.messagesWrapper} vertical={true}>
            {messages.length > 0
                ?
                messages.map((msg) =>
                        <MessageListItem
                            onDeleteMessage={onDeleteMessage}
                            onEditMessage={onEditMessage}
                            replyMessage={replyMessage}
                            onReplyMessage={onReplyMessage}
                            observer={readMessagesObserver}
                            key={"msg-" + msg.id}
                            message={msg}
                            editMessage={editMessage}
                        />
                )
                :
                <Flex justify={"center"}>
                    <Empty image={<img src={helloGif} alt=""/>} style={{marginTop: "5vh"}} description={<span style={{color :"white", fontSize: 16}}>Поки немає обрговорень. Почніть першим)!</span>}/>

                </Flex>
            }

            <div style={{float: "left", clear: "both"}} id={"chatBottom"}></div>
        </Flex>
    );
};

export default MessageList;