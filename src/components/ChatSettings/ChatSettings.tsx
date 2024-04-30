import React, {FC, useEffect} from 'react';
import {Descriptions, Drawer, Flex, Image} from "antd";
import classes from './ChatSettings.module.css'
import {CloseCircleOutlined} from "@ant-design/icons";
import {toDate} from "../../API/Util";
import {useTypedSelector} from "../../hooks/useTypedSelector";

interface ChatSettingsProps {
    open : boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ChatSettings :FC<ChatSettingsProps> = ({ open, setOpen}) => {
    const {chatInfo} = useTypedSelector(state => state.chat)


    useEffect(() => {
        console.log("OPEN")
    }, [open]);
    const onClose = () => {
        setOpen(false);
    };

    return (
        <Drawer
            title={chatInfo?.name}
            placement={'top'}
            closable
            onClose={onClose}
            open={open}
            getContainer={false}
            key={"placement"}
        >
            <Flex vertical >
                <Flex justify={"space-between"}>
                    <Flex>
                        <Image preview={false}
                               className={"nonSelect " + classes.chatPicture}
                               width={150}
                               height={150}
                               src={chatInfo?.picture}
                        />
                    </Flex>
                </Flex>
                <p className={classes.chatDescription}>{chatInfo?.description}</p>
                <Descriptions layout={"horizontal"} title={false}>

                    {chatInfo?.owner &&
                        <Descriptions.Item label={<span style={{color: "black"}}>Створив</span>}><span className={classes.userLink}>{chatInfo.owner.firstName}</span></Descriptions.Item>
                    }

                    {chatInfo?.createdOn &&
                        <Descriptions.Item label={<span style={{color: "black"}}>Чат створено</span>}><span>{toDate(chatInfo.createdOn)}</span></Descriptions.Item>
                    }
                </Descriptions>
            </Flex>
        </Drawer>


    );
};

export default ChatSettings;