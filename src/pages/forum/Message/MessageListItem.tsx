import React, {FC, useEffect, useRef} from 'react';
import {Flex, Image} from "antd";
import {toTime} from "../../../API/Util";
import {Message} from "../../../API/services/forum/ForumInterfaces";
import {useAuth0} from "@auth0/auth0-react";

interface MessageProps {
    message : Message
    observer? : IntersectionObserver
}

const MessageListItem: FC<MessageProps> = ({message, observer}) => {
    const messageRef = useRef(null)
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

    return (
        <Flex ref={messageRef} className={"message"} id={"msgId-" + message.id} gap={8}>
            <div style={{marginTop: 4}}>
                <Image className={"messageImg nonSelect"} width={35} height={35} src={message.sender.avatar}/>
            </div>
            <Flex vertical={true}>
                <Flex style={{position: "relative"}} className={"nonSelect"} gap={5} align={"center"}
                      justify={"space-between"}>
                    <span className={"senderName"}>{message.sender.name}</span>
                    <span className={"messageDate"}
                          style={{margin: 0, alignSelf: "flex-end"}}>{toTime(message.createdOn)}</span>
                </Flex>
                <div style={{marginTop: 3}}>
                    <span style={{fontWeight: "bold", display: "block"}}>{message.id}</span>
                    <span className={"messageText"}
                          style={{margin: 0, alignSelf: "flex-end"}}>{message.text}
                    </span>
                </div>
            </Flex>
        </Flex>
    );
};

export default MessageListItem;