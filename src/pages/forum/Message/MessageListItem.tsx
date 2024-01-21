import React, {FC, useCallback, useEffect, useRef} from 'react';
import {Dropdown, Flex, Image, MenuProps} from "antd";
import {Chat, Message} from "../../../API/services/forum/ForumInterfaces";
import {useAuth0} from "@auth0/auth0-react";
import {toTime} from "../../../API/Util";
import MessageImages from "./MessageImages/MessageImages";
import classes from './Message.module.css'
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {isMyMessage} from "../../../API/services/forum/UserService";

interface MessageProps {
    message: Message
    observer: IntersectionObserver
    chat?: Chat,
    onEditMessage: (message: Message) => void
    editMessage?: Message
    onReplyMessage: (message: Message) => void
    replyMessage?: Message
    onDeleteMessage: (messageId: number) => void
}


const MessageListItem: FC<MessageProps> = ({
                                               message,
                                               chat,
                                               observer,
                                               onEditMessage,
                                               editMessage,
                                               replyMessage,
                                               onReplyMessage,
                                               onDeleteMessage
                                           }) => {
    const messageRef = useRef<HTMLDivElement>(null)
    const {isAuthenticated, user} = useAuth0()
    const {lastReadMessageId, messages} = useTypedSelector(state => state.chat)
    useEffect(() => {
        if (isAuthenticated) {
            if (observer && messageRef.current && message.id > lastReadMessageId ) {
                observer.observe(messageRef.current)
                return () => observer.disconnect()
            }
        }
    }, [isAuthenticated]);


    const messageMenuItems: MenuProps['items'] = [
        {
            label: 'Відповісти',
            key: 'reply-' + message.id,
        },
        {
            label: 'Редагувати',
            key: 'edit-' + message.id,
        },
        {
            label: 'Видалити',
            key: 'delete-' + message.id,
            danger: true
        },
    ];

    async function doAction(action: string, messageId: number) {
        switch (action) {
            case 'reply':
                onReplyMessage(message)
                break
            case 'edit':
                onEditMessage(message)
                break
            case 'delete':
                onDeleteMessage(messageId)
                break
        }
    }

    const onSelectAction: MenuProps['onClick'] = ({key}) => {
        let arr = key.split("-")
        doAction(arr[0], Number(arr[1]))
    }

    const isHighlighted = useCallback(() => {
        if (editMessage !== undefined) {
            if (editMessage.id === message.id) return "isHighlighted"
        }
        if (replyMessage !== undefined) {
            if (replyMessage.id === message.id) return "isHighlighted";
        }
        return ""
    }, [editMessage, message.id, replyMessage]);

    const onRepliedMessageLinkClick = () => {
        let msg = document.getElementById("msgWrapper-" + message.repliedMessage.id)
        if (msg !== undefined) {
            let highlightedClass = classes.isHighlighted;
            let stopHighlightClass = classes.stopHighlight;
            msg?.classList.add(highlightedClass)
            setTimeout(() => {
                msg?.classList.remove(highlightedClass)
                msg?.classList.add(stopHighlightClass)

                setTimeout(() => {
                    msg?.classList.remove(stopHighlightClass)
                }, 200)
            }, 1200)

            setTimeout(() => {
                msg?.classList.remove("stopHighlight", "isHighlighted")
            }, 1600)
            msg?.scrollIntoView({behavior: "smooth", inline: "start", block: "nearest"})
        }
    }

    return (
        <div style={{width: "100%", paddingLeft: 5}}
             data-index={messages.indexOf(message)}
             className={isHighlighted()}
             id={"msgWrapper-" + message.id}
        >
            <Dropdown disabled={!isAuthenticated}
                      menu={{items: messageMenuItems, onClick: onSelectAction}}
                      trigger={['contextMenu']}
            >
                <Flex ref={messageRef}
                      className={classes.message}
                      style={{backgroundColor: isMyMessage(user?.sub, message.sender.id) ? "#4C372F" : "var(--message-bg-color)"}}
                      id={"msgId-" + message.id}
                      gap={8}
                >
                    <div style={{marginTop: 4}}>
                        <Image
                            preview={false}
                            style={{cursor: "pointer"}}
                            className={classes.messageImg + " nonSelect"}
                            width={35}
                            height={35}
                            src={message.sender.avatar}
                        />
                    </div>

                    <Flex vertical={true}>
                        <Flex style={{position: "relative"}}
                              className={"nonSelect"}
                              gap={5}
                              align={"center"}
                              justify={"space-between"}
                        >
                            <span className={classes.senderName}>{message.sender.firstName}</span>
                            <span className={classes.messageDate} style={{margin: 0, alignSelf: "flex-end"}}>
                            {toTime(message.createdOn)}
                        </span>
                        </Flex>
                        <Flex vertical style={{marginTop: 3}}>
                            <span style={{fontWeight: "bold", display: "none"}}>{message.id}</span>

                            {message.repliedMessage &&
                                <Flex onClick={onRepliedMessageLinkClick} className={classes.repliedMessage + " nonSelect"} vertical>
                                    <span>{message.repliedMessage.text}</span>
                                </Flex>
                            }

                            <MessageImages
                                message={message}
                                chat={chat}
                            />
                            <pre className={classes.messageText} style={{margin: 0, alignSelf: "flex-end"}}>
                                {message.text}
                            </pre>
                        </Flex>
                    </Flex>
                </Flex>
            </Dropdown>
        </div>
    );
};

export default MessageListItem;