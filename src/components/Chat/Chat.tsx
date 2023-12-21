import React, {FC, useState} from 'react';
import {Button, Empty, Flex, Image, Input} from "antd";
import {toTime} from "../../API/Util";
import {FileAddOutlined, FileImageFilled, FileImageOutlined, GlobalOutlined, RightOutlined} from "@ant-design/icons";
import {Message} from "../../API/services/forum/ForumInterfaces";
import {newMessage} from "../../API/services/forum/ChatService";

interface ChatProps {
    messages : Array<Message>,
    setMessages : Function,
    chatId : number
}

const ChatWindow: FC<ChatProps> = ({messages, setMessages, chatId}) => {

    const [input, setInput] = useState<string>('');

    const onSend = async () => {
        if (input !== '' && input.length < 3000) {
            const {data, error} = await newMessage({senderId : 1, text: input, chatId: chatId})
            if (data) {
                setInput('')
                let msg = messages === undefined ? [] : messages;
                setMessages([...msg, data])
            }
            if (error) throw error;
        }
    }

    return (
        <Flex vertical={true} className={"chat"} justify={"space-between"}>

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

            <Flex style={{alignSelf: "flex-end", width: "100%", padding: 3, backgroundColor: "rgba(255,255,255,0)"}}>
                <Input placeholder={"Ваше повідолення...."} value={input} onChange={(e) => setInput(e.target.value)}/>
                <Flex style={{margin: "0 5px"}} gap={3}>
                    <Button  icon={<FileAddOutlined  style={{fontSize: 22}}  />}/>
                    <Button  icon={<FileImageOutlined style={{fontSize: 22}} />}/>
                    <Button  icon={<GlobalOutlined style={{fontSize: 22}} />}/>
                </Flex>
                <Button onClick={onSend} type={"primary"} icon={<RightOutlined />}>Відправити</Button>
            </Flex>
        </Flex>
    );
};

export default ChatWindow;