import React, {FC, useCallback, useEffect, useRef} from 'react';
import {Dropdown, Flex, MenuProps} from "antd";
import {Message} from "../../../API/services/forum/ForumInterfaces";
import {useAuth0} from "@auth0/auth0-react";
import {generateContrastColor2, toTime} from "../../../API/Util";
import MessageImages from "./MessageImages/MessageImages";
import classes from './Message.module.css'
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {isMyMessage} from "../../../API/services/forum/UserService";
import FileList from "../../../components/Files/FileList";
import FileDtoList from "../../../components/Files/FileDtoList";
import UserPicture from "../../../components/UserPicture/UserPicture";

// @ts-ignore
import refrenceArrowIcon from '../../../assets/back-arrow-svgrepo-com.svg'
// @ts-ignore
import refrenceArrowIconBlack from '../../../assets/back-arrow-black.svg'
import {CopyOutlined} from "@ant-design/icons";

interface MessageProps {
    index : number
    message: Message
    observer: IntersectionObserver
    onEditMessage: (message: Message) => void
    editMessage?: Message
    onReplyMessage: (message: Message) => void
    replyMessage?: Message
    onDeleteMessage: (messageId: number) => void
}

const colorMap = new Map()

class MessageBtn {
    public id: number = 0;

    constructor(messageId: number) {
        this.id = messageId
    }


    reply = {
        label: 'Відповісти',
        key: 'reply-' + this.id,
    }
    copyText = {
        icon : <CopyOutlined />,
        label: 'Копіювати текст',
        key: 'copy-' + this.id,
    }
    forward = {
        icon :  <img  src={refrenceArrowIconBlack} height={10}
                     width={10} alt=""/>,
        label: 'Переслати',
        key: 'forward-' + this.id,
    }
    edit = {
        label: 'Редагувати',
        key: 'edit-' + this.id,
    }
    delete = {
        label: 'Видалити',
        key: 'delete-' + this.id,
        danger: true
    }

}

const MessageListItem: FC<MessageProps> = ({
                                               message,
                                               observer,
                                               onEditMessage,
                                               editMessage,
                                               replyMessage,
                                               onReplyMessage,
                                               onDeleteMessage,
                                               index
                                           }) => {
    const messageRef = useRef<HTMLDivElement>(null)
    const {isAuthenticated, user} = useAuth0()
    const {lastReadMessageId, messages} = useTypedSelector(state => state.chat)
    const {isFileDropdownActive} = useTypedSelector(state => state.dropdown)

    useEffect(() => {
        if (isAuthenticated) {
            if (observer && messageRef.current && message.id > lastReadMessageId ) {
                observer.observe(messageRef.current)
                return () => observer.disconnect()
            }
        }
    }, [isAuthenticated]);

    const btns : MessageBtn = new MessageBtn(message.id)

    const messageMenuItems: MenuProps['items'] =
        isMine(message.sender.id)
            ?
            [btns.reply, btns.copyText, btns.forward, btns.edit, btns.delete]
            :
            [btns.reply, btns.copyText, btns.forward]



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

    function isMine(id: string) {
        if (user?.sub) {
            return user.sub === id
        }
        return false;
    }

    /**
     * Checks if sender of previous message is the same as in this message
     */
    function isPrevMsgHasTheSameSender() {
        const elem = messages[index - 1];
        if (elem) {
            return messages[index -1].sender.id === message.sender.id
        }
        return false;
    }

    /**
     * Checks if sender of next message is the same as in this message
     */
    function isNextMsgHasTheSameSender() {
        const elem = messages[index + 1];
        if (elem) {
            return messages[index + 1].sender.id !== message.sender.id
        } else {
            return isPrevMsgHasTheSameSender();
        }
    }


    /**
     * generates random colors and saves is to map as value and message sender id as key
     */
    function generateContrastColor() {
        const id = message.sender.id

        // get color from map by sender id
        if (colorMap.has(id)) {
            return colorMap.get(id)

        } else {
            // generate new color and set it to map as value and user id as key
            const newColor = generateContrastColor2()
            colorMap.set(id, newColor)
            return newColor
        }
    }



    return (
        <Flex data-index={messages.indexOf(message)}
              justify={"center"}
              className={[isHighlighted(), classes.messageMainWrapper].join(' ')}
              id={"msgWrapper-" + message.id}
        >
            <Flex className={classes.messageWrapper2}
                  justify={isMine(message.sender.id) ? "flex-end" : "flex-start"}
            >
                <Dropdown
                    menu={{items: messageMenuItems, onClick: onSelectAction}}
                    trigger={['contextMenu']}
                >
                    <Flex ref={messageRef}
                          className={classes.message}
                          style={{backgroundColor: isMyMessage(user?.sub, message.sender.id) ? "#8d654c" : "var(--message-bg-color)", margin : isPrevMsgHasTheSameSender() ? "0px 3em 5px 0" : "5px 3em 5px 0"}}
                          id={"msgId-" + message.id}
                          gap={8}
                    >


                        <Flex vertical={true} style={{paddingBottom: 3}}>
                            <Flex style={{position: "relative"}}
                                  className={"nonSelect"}
                                  gap={8}
                                  align={"center"}
                                  justify={"space-between"}
                            >
                                <Flex gap={5} align={"center"}>
                                    <div></div>
                                    {!isPrevMsgHasTheSameSender() &&
                                        <span className={classes.senderName} style={{color: generateContrastColor()}}>{message.sender.firstName}</span>
                                    }

                                </Flex>

                                <span className={classes.messageDate} style={{margin: 0}}>
                                    {toTime(message.createdOn)}
                                </span>

                            </Flex>
                            <Flex vertical style={{marginTop: 3}}>
                                <span style={{fontWeight: "bold", display: "none"}}>{message.id}</span>

                                {message.repliedMessage &&
                                    <Flex onClick={onRepliedMessageLinkClick}
                                          className={classes.repliedMessage + " nonSelect"} vertical>
                                        <span>{message.repliedMessage.text}</span>
                                    </Flex>
                                }

                                <MessageImages message={message}/>

                                {message.fileDtoList
                                    &&
                                    <FileDtoList files={message.fileDtoList}/>
                                }

                                {message.filesList
                                    &&
                                    <FileList messageFiles={message.filesList}/>
                                }

                                <pre className={classes.messageText} style={{margin: 0, alignSelf: "flex-end"}}>
                                    {message.text}
                                </pre>

                            </Flex>

                        </Flex>
                        {(isNextMsgHasTheSameSender()) &&
                            <>
                                {isMine(message.sender.id)
                                    ?
                                    <div style={{position: "absolute", bottom: 3, right: -40}}>
                                        <UserPicture user={message.sender}/>
                                    </div>
                                    :
                                    <div style={{position: "absolute", bottom: 3, left: -40}}>
                                        <UserPicture user={message.sender}/>
                                    </div>
                                }
                            </>


                        }

                        {isPrevMsgHasTheSameSender() &&
                            <img style={{position: "absolute", bottom: 3, right: 5}} src={refrenceArrowIcon} height={10}
                                 width={10} alt=""/>
                        }
                    </Flex>
                </Dropdown>
            </Flex>

        </Flex>
    );
};

export default MessageListItem;