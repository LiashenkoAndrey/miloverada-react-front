import React, {FC, useEffect} from 'react';
import {Button, Descriptions, Flex, Image} from "antd";
import classes from './ChatSettings.module.css'
import {IChat} from "../../API/services/forum/ForumInterfaces";
import {CloseCircleOutlined} from "@ant-design/icons";
import {toDate, toTime} from "../../API/Util";

interface ChatSettingsProps {
    chat? : IChat
    setIsSettingsActive :  React.Dispatch<React.SetStateAction<boolean>>
}

const ChatSettings :FC<ChatSettingsProps> = ({chat, setIsSettingsActive}) => {
    console.log(chat)
    useEffect(() => {
        console.log(chat?.createdOn)
    }, [chat]);

    return (
        <Flex vertical className={classes.ChatSettings}>
            <Flex justify={"space-between"}>
                <Flex>
                    <Image preview={false}
                           onClick={() => setIsSettingsActive(true)}
                           className={"nonSelect " + classes.chatPicture}
                           width={150}
                           height={150}
                           src={chat?.picture}
                    />
                </Flex>
                <CloseCircleOutlined
                    style={{fontSize: 25, height: "fit-content"}}
                    onClick={() => setIsSettingsActive(false)}
                />

            </Flex>
            <p className={classes.chatDescription}>{chat?.description}</p>
            <Descriptions layout={"horizontal"} title={false}>

                {chat?.owner &&
                    <Descriptions.Item label={<span style={{color: "black"}}>Створив</span>}><span className={classes.userLink}>{chat.owner.firstName}</span></Descriptions.Item>
                }

                {chat?.createdOn &&
                    <Descriptions.Item label={<span style={{color: "black"}}>Чат створено</span>}><span>{toDate(chat.createdOn)}</span></Descriptions.Item>
                }
            </Descriptions>
        </Flex>
    );
};

export default ChatSettings;