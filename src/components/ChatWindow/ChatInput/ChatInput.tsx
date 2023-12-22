import React, {ChangeEventHandler, FC, MouseEventHandler} from 'react';
import {Button, Flex, Input} from "antd";
import {FileAddOutlined, FileImageOutlined, GlobalOutlined, RightOutlined} from "@ant-design/icons";

interface ChatInputProps {
    input : string,
    handleEvent : ChangeEventHandler<HTMLInputElement>,
    onSend : MouseEventHandler<HTMLElement>
}

const ChatInput :FC<ChatInputProps> = ({input, handleEvent, onSend}) => {
    return (
        <Flex style={{alignSelf: "flex-end", width: "100%", padding: 3, backgroundColor: "rgba(255,255,255,0)"}}>
            <Input placeholder={"Ваше повідолення...."} value={input} onChange={handleEvent}/>
            <Flex style={{margin: "0 5px"}} gap={3}>
                <Button  icon={<FileAddOutlined  style={{fontSize: 22}}  />}/>
                <Button  icon={<FileImageOutlined style={{fontSize: 22}} />}/>
                <Button  icon={<GlobalOutlined style={{fontSize: 22}} />}/>
            </Flex>
            <Button onClick={onSend} type={"primary"} icon={<RightOutlined />}>Відправити</Button>
        </Flex>
    );
};

export default ChatInput;