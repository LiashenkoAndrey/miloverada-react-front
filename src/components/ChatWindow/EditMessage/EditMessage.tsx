import React, {FC, useEffect, useState} from 'react';
import {CloseCircleOutlined, EditOutlined} from "@ant-design/icons";
import {Flex} from "antd";
import {Message} from "../../../API/services/forum/ForumInterfaces";

interface EditMessageProps {
    setEditMessage :  React.Dispatch<React.SetStateAction<Message | undefined>>
    editMessage? : Message
    setInput :  React.Dispatch<React.SetStateAction<string>>
    inputRef :  React.MutableRefObject<HTMLTextAreaElement | null>
}

const EditMessage : FC<EditMessageProps> = ({setEditMessage, editMessage, setInput, inputRef}) => {
    const [isActive, setIsActive] = useState<boolean>(false)

    const onEditCansel = () => {
        setIsActive(false)
        setInput("")
        setEditMessage(undefined)
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
        setIsActive(editMessage !== undefined)
    }, [editMessage]);

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
                    <span style={{fontWeight: 600, fontSize: 16}}>Редагування повідомлення</span>
                    {editMessage &&
                        <span>{editMessage.text}</span>
                    }
                </Flex>
            </Flex>


            <CloseCircleOutlined onClick={onEditCansel} style={{
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

export default EditMessage;