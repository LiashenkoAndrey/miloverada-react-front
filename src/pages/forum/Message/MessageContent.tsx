import React, {FC} from 'react';
import {Message} from "../../../API/services/forum/ForumInterfaces";
import {Flex} from "antd";
import classes from "./Message.module.css";
import MessageImages from "./MessageImages/MessageImages";
import FileDtoList from "../../../components/Files/FileDtoList";
import FileList from "../../../components/Files/FileList";

interface MessageContentProps {
    message : Message
}

const MessageContent:FC<MessageContentProps> = ({message}) => {

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
        <>
            {message.repliedMessage &&
                <Flex onClick={onRepliedMessageLinkClick}
                      className={classes.repliedMessage + " nonSelect"} vertical>
                    <span>{message.repliedMessage.text}</span>
                </Flex>
            }

            {/*{message.forwardedMessage &&*/}
            {/*    <div>*/}
            {/*        <p>{message.forwardedMessage.text}</p>*/}
            {/*    </div>*/}
            {/*}*/}

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
        </>
    );
};

export default MessageContent;