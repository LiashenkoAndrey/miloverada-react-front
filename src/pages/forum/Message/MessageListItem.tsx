import React, {FC, useCallback, useEffect, useRef} from 'react';
import {Dropdown, Flex, Image, MenuProps} from "antd";
import {Chat, Message} from "../../../API/services/forum/ForumInterfaces";
import {useAuth0} from "@auth0/auth0-react";
import {toTime} from "../../../API/Util";
import MessageImages from "./MessageImages/MessageImages";
import './Message.css'

interface MessageProps {
    message : Message
    observer? : IntersectionObserver
    chat?: Chat,
    onEditMessage : (message : Message) => void
    editMessage? : Message
    onReplyMessage : (message : Message) => void
    replyMessage? : Message
    onDeleteMessage : (messageId : number) => void
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
    const {isAuthenticated} = useAuth0()


    useEffect(() => {
        if (isAuthenticated) {
            if (observer && messageRef.current) {
                observer.observe(messageRef.current)
            } else {
                console.log("one is null", observer, messageRef.current)
            }
        }
    }, [messageRef]);



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
            danger : true

        },
    ];

    async function doAction(action : string, messageId : number) {
        switch (action) {
            case 'reply':
                console.log("reply msg", messageId)
                onReplyMessage(message)
                break
            case 'edit':
                console.log("edit msg", messageId)
                onEditMessage(message)
                break
            case 'delete':
                console.log("delete msg", messageId)
                onDeleteMessage(messageId)
                break
        }
    }


    const onSelectAction: MenuProps['onClick'] = ({key})   => {
        console.log("action", key)
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


    
    return (
        <div style={{width: "100%", paddingLeft: 5}} className={isHighlighted()} id={"msgWrapper-" + message.id}>
            <Dropdown disabled={!isAuthenticated}
                      menu={{items : messageMenuItems, onClick : onSelectAction}}
                      trigger={['contextMenu']}
            >
                <Flex ref={messageRef}
                      className={"message"}
                      id={"msgId-" + message.id}
                      gap={8}
                >
                    <div style={{marginTop: 4}}>
                        <Image
                            preview={false}
                            style={{cursor: "pointer"}}
                            className={"messageImg nonSelect"}
                            width={35}
                            height={35}
                            src={message.sender.avatar}
                        />
                    </div>

                    <Flex vertical={true} >
                        <Flex style={{position: "relative"}}
                              className={"nonSelect"}
                              gap={5}
                              align={"center"}
                              justify={"space-between"}
                        >
                            <span className={"senderName"}>{message.sender.name}</span>
                            <span className={"messageDate"} style={{margin: 0, alignSelf: "flex-end"}}>
                            {toTime(message.createdOn)}
                        </span>
                        </Flex>
                        <Flex vertical style={{marginTop: 3}}>
                            <span style={{fontWeight: "bold", display: "none"}}>{message.id}</span>

                            {message.repliedMessage &&
                                <Flex onClick={() => {
                                    console.log("msgWrapper-" + message.repliedMessage.id)
                                    let msg = document.getElementById("msgWrapper-" + message.repliedMessage.id)
                                    console.log(message)
                                    if (msg) {
                                        console.log(msg)
                                        msg.classList.add("isHighlighted")
                                        setTimeout(() => {
                                            msg?.classList.add("stopHighlight")

                                        }, 1200)

                                        setTimeout(() => {
                                          msg?.classList.remove("stopHighlight","isHighlighted")
                                        }, 1600)
                                        msg.scrollIntoView({behavior: "smooth", inline: "start", block: "nearest"})
                                    }
                                }} className={"repliedMessage"} vertical>
                                    <span>{message.repliedMessage.text}</span>
                                </Flex>
                            }

                            <MessageImages
                                message={message}
                                chat={chat}
                            />
                            <pre className={"messageText"} style={{margin: 0, alignSelf: "flex-end"}}>
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