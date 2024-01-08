import React, {FC, useCallback, useContext, useEffect, useRef} from 'react';
import {App, Dropdown, Flex, Image, MenuProps} from "antd";
import {Chat, DeleteMessageDto, Message} from "../../../API/services/forum/ForumInterfaces";
import {useAuth0} from "@auth0/auth0-react";
import {deleteMessageById} from "../../../API/services/forum/MessageService";
import {AuthContext} from "../../../context/AuthContext";
import {useStompClient} from "react-stomp-hooks";
import {toTime} from "../../../API/Util";
import MessageImages from "./MessageImages/MessageImages";
import './Message.css'

interface MessageProps {
    message : Message
    observer? : IntersectionObserver
    setMessages :  React.Dispatch<React.SetStateAction<Message[]>>
    messages: Array<Message>
    chat?: Chat,
    omMessageImageUpdate : Function
    onEditMessage : (message : Message) => void
    editMessage? : Message
}


const MessageListItem: FC<MessageProps> = ({
                                               message,
                                               chat,
                                               observer,
                                               setMessages,
                                               messages,
                                               onEditMessage, editMessage
                                           }) => {
    const messageRef = useRef(null)
    const {isAuthenticated} = useAuth0()
    const {jwt, setJwt} = useContext(AuthContext)
    const {notification} = App.useApp();
    const stompClient = useStompClient()

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
        if (jwt) {
            switch (action) {
                case 'reply':
                    break
                case 'edit':
                    console.log("edit msg", messageId)
                    onEditMessage(message)
                    // updateMessage()
                    break
                case 'delete':
                    console.log("delete msg", messageId)
                    const {error} = await deleteMessageById(messageId, jwt)
                    if (error) {
                        notification.error({message: "can't delete message"})
                    } else {
                        setMessages(messages.filter((msg) => msg.id !== messageId))
                        notifyThatMessageWasDeleted(messageId)
                        notification.success({message: "Видалено успішно"})
                    }
                    break
            }
        }
    }
    // todo add update message feature
    // const updateMsg = async (messageId : number, jwt : string) => {
    //     const {error} = await updateMessage(jwt)
    //     if (error) {
    //         notification.error({message: "can't update message"})
    //     } else {
    //         setMessages(messages.filter((msg) => msg.id !== messageId))
    //         notifyThatMessageWasDeleted(messageId)
    //         notification.success({message: "Видалено успішно"})
    //     }
    // }


    const notifyThatMessageWasDeleted = (messageId : number) => {
        if (stompClient && chat?.id) {
            const body : DeleteMessageDto = {
                messageId : messageId,
                chatId : chat?.id
            }

            stompClient.publish({
                destination : "/app/userMessage/wasDeleted",
                body : JSON.stringify(body)
            })
        } else notification.error({message : "can't notify that deleted message"})
    }

    const onSelectAction: MenuProps['onClick'] = ({key})   => {
        console.log("action", key)
        let arr = key.split("-")
        doAction(arr[0], Number(arr[1]))
    }

    const isEdit = useCallback(() => {
        if (editMessage !== undefined) {
            if (editMessage.id === message.id) return "isEdit"
        }
        return ""
    }, [editMessage, message.id]);

    
    return (
        <div style={{width: "100%", paddingLeft: 5}} className={isEdit()}>
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
                            <span style={{fontWeight: "bold", display: "block"}}>{message.id}</span>
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