import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {Empty, Flex} from "antd";
import {Chat, Message} from "../../../API/services/forum/ForumInterfaces";
import MessageListItem from "../../../pages/forum/Message/MessageListItem";
import {useAuth0} from "@auth0/auth0-react";

interface MessageListProps {
    messages: Array<Message>
    chat?: Chat,
    unreadMessagesCount? : number
    setUnreadMessagesCount : React.Dispatch<React.SetStateAction<number | undefined>>
    saveLastReadMessageId(messageId: number): void
    lastReadMessageId? : number
    setMessages :  React.Dispatch<React.SetStateAction<Message[]>>
    onEditMessage : (message : Message) => void
    editMessage? : Message
}

const MessageList: FC<MessageListProps> = ({
                                               chat,
                                               messages,
                                               setUnreadMessagesCount,
                                               unreadMessagesCount,
                                               saveLastReadMessageId,
                                               setMessages,
                                               lastReadMessageId,onEditMessage, editMessage
                                           }) => {

    const readMessagesObserver = useRef<IntersectionObserver>()
    const {isAuthenticated} = useAuth0()

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

    const imageUpdateInputRef = useRef<HTMLInputElement | null>(null)


    const omMessageImageUpdate = () => {
        imageUpdateInputRef.current?.click()
    }

    return (
        <Flex id={"msgWrapper"} className={"messagesWrapper"} vertical={true}>
            {messages.length > 0
                ?
                messages.map((msg) =>
                        <MessageListItem
                            onEditMessage={onEditMessage}
                            omMessageImageUpdate={omMessageImageUpdate}
                            chat={chat}
                            messages={messages}
                            observer={readMessagesObserver.current}
                            key={"msg-" + msg.id}
                            setMessages={setMessages}
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