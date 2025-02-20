import React, {FC, useEffect, useState} from 'react';
import {Flex} from "antd";
import {CloseCircleOutlined, EditOutlined} from "@ant-design/icons";
import {Message} from "../../../../API/services/forum/ForumInterfaces";

interface ReplyToMessageProps {
    setImageList :  React.Dispatch<React.SetStateAction<string[]>>
    replyMessage? : Message
    setReplyMessage : React.Dispatch<React.SetStateAction<Message | undefined>>
    inputRef :  React.MutableRefObject<HTMLTextAreaElement | null>
}

const ReplyToMessage : FC<ReplyToMessageProps> = ({
                                                      setImageList,
                                                      replyMessage,
                                                      setReplyMessage,
                                                      inputRef}) => {
    const [isActive, setIsActive] = useState<boolean>(false)

    const onReplyCansel = () => {
        setImageList([])
        setReplyMessage(undefined)
        setIsActive(false)
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
        setIsActive(replyMessage !== undefined)
    }, [replyMessage])

    return (
        <div style={{
            display: isActive ? "block" : "none",
            padding: "5px 10px",
            backgroundColor: "rgba(0,0,0,0.29)",
            position: "relative",
            borderTop: "solid rgba(0,0,0,0.40)"
        }}>
            <Flex gap={5}>
                <EditOutlined style={{color: "white", fontSize: 20}}  />
                <Flex style={{color: "white"}} vertical>
                    <span style={{fontWeight: 600, fontSize: 16}}>Відповідь на повідомлення</span>
                    {replyMessage &&
                        <span>{replyMessage.text}</span>
                    }
                </Flex>
            </Flex>


            <CloseCircleOutlined onClick={onReplyCansel} style={{
                position: "absolute",
                right: 10,
                top: 10,
                fontSize: 20,
                color: "white",
                cursor: "pointer"
            }}/>
        </div>
    );
};

export default ReplyToMessage;