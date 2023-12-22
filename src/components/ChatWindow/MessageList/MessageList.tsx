import React, {FC} from 'react';
import {Empty, Flex, Image} from "antd";
import {toTime} from "../../../API/Util";
import {Message} from "../../../API/services/forum/ForumInterfaces";

interface MessageListProps {
    messages : Array<Message>
}

const MessageList: FC<MessageListProps> = ({messages}) => {
    return (
        <Flex className={"messagesWrapper"} vertical={true}>
            {messages.length > 0
                ?
                messages.map((msg) =>
                    <Flex className={"message"} key={"msg-"+msg.id} gap={8} >
                        <div style={{marginTop: 4}}>
                            <Image className={"messageImg nonSelect"} width={35} height={35} src={msg.sender.avatar}/>
                        </div>
                        <Flex vertical={true}>
                            <Flex style={{position: "relative"}} className={"nonSelect"} gap={5} align={"center"} justify={"space-between"}>
                                <span className={"senderName"}>{msg.sender.name}</span>
                                <span className={"messageDate"} style={{margin: 0, alignSelf: "flex-end"}} >{toTime(msg.createdOn)}</span>
                            </Flex>
                            <div style={{marginTop: 3}}>
                                <span className={"messageText"} style={{margin: 0, alignSelf: "flex-end"}} >{msg.text}</span>
                            </div>
                        </Flex>
                    </Flex>
                )
                :
                <Empty style={{marginTop: "5vh"}} description={"Поки немає обрговорень. Почніть першим)!"}/>
            }
        </Flex>
    );
};

export default MessageList;