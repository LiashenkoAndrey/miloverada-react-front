import React, {FC} from 'react';
import {ConfigProvider, Flex} from "antd";
import chat_classes from "../ChatWindow/ChatWindow.module.css";
import {CloseOutlined, DeleteOutlined} from "@ant-design/icons";
import classes from './SelectionToolbar.module.css'
// @ts-ignore
import referenceArrowIconBlack from "../../../assets/back-arrow-svgrepo-com.svg";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {useActions} from "../../../hooks/useActions";
import {useAuth0} from "@auth0/auth0-react";


interface SelectionToolbarProps {
    onDeleteMessage : (messageId: number) => void
}

const SelectionToolbar: FC<SelectionToolbarProps> = ({onDeleteMessage}) => {
    const {isSelectionEnabled, selectedMessages} = useTypedSelector(state => state.chat)
    const {setIsSelectionEnabled, setSelectedMessages, setIsSelectChatToForwardMessageModalActive} = useActions()
    const {user} = useAuth0()
    const onDisableSelection = () => {
        setSelectedMessages([])
        setIsSelectionEnabled(false)
    }

    const onDeleteMessages = () => {
        if (user?.sub) {

            selectedMessages.forEach((selectedMessage) => {
                if (selectedMessage.sender.id === user.sub) {
                    onDeleteMessage(selectedMessage.id)
                }
            })
            setSelectedMessages([])
            setIsSelectionEnabled(false)
        }
    }


    const onReplyAll = () => {
        console.log("enable forward modal")
        setIsSelectChatToForwardMessageModalActive(true)
    }

    function hasMyMessages() {
        for (let i = 0; i < selectedMessages.length; i++) {
            if (user?.sub) {
                if (selectedMessages[i].sender.id === user.sub) {
                    return true;
                }
            } else {console.error("user sub null")}
        }
        return false
    }

    return (
        <ConfigProvider theme={{
            components: {
                Button: {
                    colorBorder: "rgba(37,187,26,0)",
                    colorBgContainer: 'rgba(113,9,44,0)'
                }
            }
        }}>
            {isSelectionEnabled &&
                <Flex justify={"center"} className={chat_classes.selectionToolbarWrapper}>
                    <Flex justify={"space-between"} className={chat_classes.selectionToolbar}>

                        <CloseOutlined className={classes.btn}
                                       onClick={onDisableSelection}
                        />
                        <Flex gap={3}>
                            {hasMyMessages() &&
                                <DeleteOutlined onClick={onDeleteMessages}
                                                className={[classes.btn, classes.btnDanger].join(' ')}
                                />
                            }


                            <div onClick={onReplyAll} className={classes.btn} style={{padding: "1px 5px"}}>
                                <img src={referenceArrowIconBlack} height={30} width={30} alt="" style={{
                                    rotate: "180deg",
                                    transform: "scaleY(-1)", position: "relative", top: -2
                                }}/>
                            </div>
                        </Flex>
                    </Flex>
                </Flex>

            }
        </ConfigProvider>
    );
};

export default SelectionToolbar;