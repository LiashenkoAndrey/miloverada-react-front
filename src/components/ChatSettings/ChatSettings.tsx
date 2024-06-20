import React, {FC, useEffect} from 'react';
import {Descriptions, Drawer, Flex, Image} from "antd";
import classes from './ChatSettings.module.css'
import {CloseCircleOutlined, CloseOutlined} from "@ant-design/icons";
import {toDate} from "../../API/Util";
import {useTypedSelector} from "../../hooks/useTypedSelector";

interface ChatSettingsProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ChatSettings: FC<ChatSettingsProps> = ({open, setOpen}) => {
    const {chatInfo} = useTypedSelector(state => state.chat)


    useEffect(() => {
        console.log("OPEN")
    }, [open]);
    const onClose = () => {
        setOpen(false);
    };

    return (
        <Drawer
            style={{backgroundColor: "var(--chat-header-bg-color)", color: "white"}}
            title={<span style={{color: "white", userSelect : 'none'}}>{chatInfo?.name}</span>}
            placement={'top'}
            closeIcon={<CloseOutlined style={{color : "white"}}/>}
            closable
            onClose={onClose}
            open={open}
            getContainer={false}
            key={"placement"}
        >
            <Flex vertical>
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
                <p className={classes.chatDescription} style={{color: "white"}}>{chatInfo?.description}</p>
                <Descriptions layout={"horizontal"} title={false}>

                    {chatInfo?.owner &&
                        <Descriptions.Item label={<span style={{color: "white"}}>Створив</span>}>
                            <span className={classes.userLink}>
                            {chatInfo.owner.nickname}</span>
                        </Descriptions.Item>
                    }

                    {chatInfo?.createdOn &&
                        <Descriptions.Item label={<span style={{color: "white"}}>Чат створено</span>}>
                            <span style={{color: "white"}}>{toDate(chatInfo.createdOn)}</span>
                        </Descriptions.Item>
                    }
                </Descriptions>
            </Flex>
        </Drawer>


    );
};

export default ChatSettings;
