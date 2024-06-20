import React, {FC, useCallback, useEffect, useRef} from 'react';
import {Checkbox, ConfigProvider, Dropdown, Flex, MenuProps, message as antdMessage} from "antd";
import {Message} from "../../../API/services/forum/ForumInterfaces";
import {useAuth0} from "@auth0/auth0-react";
import {generateContrastColor2, toTime} from "../../../API/Util";
import classes from './Message.module.css'
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {isMyMessage} from "../../../API/services/forum/UserService";
import UserPicture from "../../../components/UserPicture/UserPicture";


// @ts-ignore
import referenceArrowIconSilver from '../../../assets/back-arrow-svgrepo-com.svg'
// @ts-ignore
import refrenceArrowIconBlack from '../../../assets/back-arrow-black.svg'


// @ts-ignore
import forwardIcon from '../../../assets/forwardIcon.svg'

import {CheckCircleOutlined, CheckOutlined, CopyOutlined, DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {useActions} from "../../../hooks/useActions";
import MessageContent from "./MessageContent";

interface MessageProps {
    index: number
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

    select = {
        icon: <CheckCircleOutlined className={classes.dropDownOptionIcon}/>,
        label: <span className={classes.dropDownOptionTitle}>Виділити</span>,
        key: 'select-' + this.id,
    }
    reply = {
        icon: <img src={refrenceArrowIconBlack} height={20} width={20} alt=""/>,
        label: <span className={classes.dropDownOptionTitle}>Відповісти</span>,
        key: 'reply-' + this.id,
    }
    copyText = {
        icon: <CopyOutlined className={classes.dropDownOptionIcon}/>,
        label: <span className={classes.dropDownOptionTitle}>Копіювати текст</span>,
        key: 'copy-' + this.id,
    }
    forward = {
        icon: <img src={refrenceArrowIconBlack} height={20} width={20} alt="" style={{rotate: "180deg"}}/>,
        label: <span className={classes.dropDownOptionTitle}>Переслати</span>,
        key: 'forward-' + this.id,
    }
    edit = {
        icon: <EditOutlined className={classes.dropDownOptionIcon}/>,
        label: <span className={classes.dropDownOptionTitle}>Редагувати</span>,
        key: 'edit-' + this.id,
    }
    delete = {
        icon: <DeleteOutlined className={classes.dropDownOptionIcon}/>,
        label: <span className={classes.dropDownOptionTitle}>Видалити</span>,
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
                                               index,
                                           }) => {
    const messageRef = useRef<HTMLDivElement>(null)
    const {isAuthenticated, user} = useAuth0()
    const {lastReadMessageId, messages, isSelectionEnabled, selectedMessages} = useTypedSelector(state => state.chat)
    const {setIsSelectionEnabled, setSelectedMessages, setIsSelectChatToForwardMessageModalActive} = useActions()

    useEffect(() => {
        if (isAuthenticated) {
            if (observer && messageRef.current && message.id > lastReadMessageId) {
                observer.observe(messageRef.current)
                return () => observer.disconnect()
            }
        }
    }, [isAuthenticated]);

    const btns: MessageBtn = new MessageBtn(message.id)

    const messageMenuItems: MenuProps['items'] =
        isMine(message.sender.id)
            ?
            [btns.reply, btns.copyText, btns.forward, btns.edit, btns.select, btns.delete]
            :
            isAuthenticated
                ?
                [btns.reply, btns.copyText, btns.forward, btns.select]
                :
                [btns.copyText]


    async function doAction(action: string, messageId: number) {
        switch (action) {
            case 'reply':
                onReplyMessage(message)
                break
            case 'edit':
                onEditMessage(message)
                break
            case 'delete':
                onDeleteMessage(message.id)
                break
            case 'select' :
                setIsSelectionEnabled(true)
                setSelectedMessages([...selectedMessages, message])
                break
            case 'copy' :
                await navigator.clipboard.writeText(message.text)
                antdMessage.success({content: "Текст скопійовано", icon: <CheckOutlined/>})
                break
            case 'forward':
                setSelectedMessages([message])
                setIsSelectChatToForwardMessageModalActive(true)
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
            const elem = messages[index - 1].sender.id === message.sender.id
            console.log("isPrevMsgHasTheSameSender", message.text, elem)
            return  elem;
        } else console.log("isPrevMsgHasTheSameSender else", message)
        return false;
    }

    /**
     * Checks if sender of next message is the same as in this message
     */
    function isNextMsgHasTheSameSender() {
        const elem = messages[index + 1];
        if (elem) {
            const elem = messages[index + 1].sender.id !== message.sender.id
            console.log('isNextMsgHasTheSameSender',message.text, elem)
            return elem;
        } else {

            console.log('isNextMsgHasTheSameSender else', message)
            return !isPrevMsgHasTheSameSender();
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


    const onMessageClick = () => {
        if (isSelectionEnabled) {
            if (selectedMessages.includes(message)) {
                setSelectedMessages([...selectedMessages.filter((e) => e.id !== message.id)])
            } else {
                setSelectedMessages([...selectedMessages, message])
            }
        }
    }

    return (
        <Dropdown
            disabled={isSelectionEnabled}
            menu={{items: messageMenuItems, onClick: onSelectAction}}
            trigger={['contextMenu']}
        >
            <Flex onClick={onMessageClick}
                  style={{
                      cursor: isSelectionEnabled ? "pointer" : "initial",
                      margin: isPrevMsgHasTheSameSender() ? "0px 3em 0px 0" : "9px 3em 0px 0"
                  }}
                  data-index={messages.indexOf(message)}
                  justify={"center"}
                  onDoubleClick={() => onEditMessage(message)}
                  className={[isHighlighted(), classes.messageMainWrapper, (isSelectionEnabled && !selectedMessages.includes(message)) ? classes.selectable : "", selectedMessages.includes(message) ? classes.selected : ""].join(' ')}
                  id={"msgWrapper-" + message.id}
            >

                <Flex className={classes.messageWrapper2}
                      justify={isMine(message.sender.id) ? "flex-end" : "flex-start"}
                >
                    <Flex ref={messageRef}
                          className={classes.message}
                          style={{backgroundColor: isMyMessage(user?.sub, message.sender.id) ? "#8d654c" : "var(--message-bg-color)"}}
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
                                    {(!isPrevMsgHasTheSameSender() && message.sender) &&
                                        <span className={classes.senderName}
                                              style={{color: generateContrastColor()}}>{message.sender.firstName}</span>
                                    }

                                    {message.forwardedMessage &&
                                        <Flex gap={5}>
                                            <img src={forwardIcon} height={25} width={25} alt="" style={{
                                                rotate: "180deg",
                                                transform: "scaleY(-1)", position: "relative", top: -2
                                            }}/>
                                            <span className={classes.senderName}
                                                  style={{color: generateContrastColor()}}>{message.forwardedMessage.sender.firstName}</span>

                                        </Flex>
                                    }
                                </Flex>

                                <span className={classes.messageDate} style={{margin: 0}}>
                                    {toTime(message.createdOn)}
                                </span>

                            </Flex>
                            <Flex vertical style={{marginTop: 3}}>
                                <span style={{fontWeight: "bold", display: "none"}}>{message.id}</span>

                                <MessageContent message={message}/>

                                {message.forwardedMessage &&
                                    <MessageContent message={message.forwardedMessage}/>
                                }
                            </Flex>

                        </Flex>
                        {(isNextMsgHasTheSameSender() || messages.length == 1) &&
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
                            <img style={{position: "absolute", bottom: 3, right: 5}} src={referenceArrowIconSilver}
                                 height={10}
                                 width={10} alt=""/>
                        }

                    </Flex>

                    <ConfigProvider theme={{
                        components: {
                            Checkbox: {
                                borderRadiusSM: 20,
                                colorBgContainer: 'rgba(113,9,44,0)'
                            }
                        }
                    }}>
                        {isSelectionEnabled &&
                            <div style={{
                                position: "absolute",
                                bottom: 10,
                                left: -80
                            }}>
                                <Checkbox
                                    checked={selectedMessages.includes(message)}
                                    className={classes.messageCheckBox}
                                />
                            </div>

                        }

                    </ConfigProvider>
                </Flex>
            </Flex>
        </Dropdown>

    );
};

export default MessageListItem;
