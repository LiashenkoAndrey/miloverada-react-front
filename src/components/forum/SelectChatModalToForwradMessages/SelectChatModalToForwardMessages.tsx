import React, {useContext, useEffect, useState} from 'react';
import {Avatar, ConfigProvider, Flex, List, Modal} from "antd";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {useActions} from "../../../hooks/useActions";
import locale from "antd/es/locale/uk_UA";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import chatListClasses from "../ChatsList/ChatList.module.css";
import {useAuth0} from "@auth0/auth0-react";
import {AuthContext} from "../../../context/AuthContext";
import {useStompClient} from "react-stomp-hooks";
import {ForwardMessagesDto} from "../../../API/services/forum/MessageDto";
import {forwardMessages} from "../../../API/services/forum/MessageService";
import {getUserVisitedChats} from "../../../API/services/forum/ChatService";

const SelectChatModalToForwardMessages = () => {
    const {isSelectChatToForwardMessageModalActive} = useTypedSelector(state => state.chat)
    const {setIsSelectChatToForwardMessageModalActive, setChats, setIsSelectionEnabled, setSelectedMessages} = useActions()
    const [selectedChatsToForward, setSelectedChatsToForward] = useState<number[]>([])
    const {chats} = useTypedSelector(state => state.forum)
    const {selectedMessages, chatId} = useTypedSelector(state => state.chat)
    const {user} = useAuth0()
    const {jwt} = useContext(AuthContext)
    const [isOkBtnDisabled, setIsOkBtnDisabled] = useState<boolean>(false)
    const stompClient = useStompClient()

    const onForward = () => {
        if (stompClient && user?.sub) {
            const dto : ForwardMessagesDto = {
                toChatsIdList : selectedChatsToForward,
                messagesIdList : selectedMessages.map((message) => message.id),
                fromChatId : chatId,
                encodedSenderId : encodeURIComponent(user.sub)
            }
            console.log("dto to save = ", dto)

            forwardMessages(stompClient, dto)
            setSelectedMessages([])
            setIsSelectionEnabled(false)
            setIsSelectChatToForwardMessageModalActive(false)
        }  else console.error("stompClient null")

    }

    const getAll = async () => {
        if (jwt && user?.sub) {
            const {data} = await getUserVisitedChats(decodeURIComponent(user.sub), jwt)
            if (data) {
                setChats(data)
            }

        } else console.log("not auth")
    }

    const onSelectChat = (chatId: number) => {
        if (selectedChatsToForward.includes(chatId)) {
            setSelectedChatsToForward(selectedChatsToForward.filter((e) => e !== chatId))
        } else  {
            setSelectedChatsToForward([...selectedChatsToForward, chatId])
        }
    }

    useEffect(() => {
        getAll()
    }, [jwt]);

    useEffect(() => {
    }, [isSelectChatToForwardMessageModalActive]);


    const handleCancel = () => {
        setIsSelectChatToForwardMessageModalActive(false)
        setIsSelectionEnabled(false)
    };

    useEffect(() => {
        setIsOkBtnDisabled(selectedChatsToForward.length === 0)
    }, [selectedChatsToForward]);


    return (
        <ConfigProvider locale={locale} theme={{
            components : {
                Modal : {
                    contentBg : "var(--forum-primary-bg-color)",
                    headerBg: "var(--forum-primary-bg-color)",
                    titleColor : "var(--forum-primary-text-color)"
                },
                Button : {
                    colorBgContainerDisabled : "#4f0720",
                    borderColorDisabled : "none",
                    colorTextDisabled : "#797676",
                    defaultBg : "var(--forum-primary-text-color)",
                },
                Checkbox : {
                    borderRadiusSM : 20,
                    colorBgContainer : 'rgba(113,9,44,0)'
                }

            }
        }}>
            <Modal title={"Переслати повідомлення"}
                   closeIcon={<CloseOutlined style={{fontSize: 18, color: "var(--forum-primary-text-color)"}}/>}
                   open={isSelectChatToForwardMessageModalActive}
                   onOk={onForward}
                   cancelButtonProps={{style : {fontWeight : "600"}}}
                   okButtonProps={{style : {fontWeight : "600"}, disabled : isOkBtnDisabled}}
                   onCancel={handleCancel}
            >
                <Flex style={{maxHeight: 500, overflowY: "scroll"}}
                      className={"forumStyledScrollBar"}
                >
                    <List key={"chatList-" }
                          className={chatListClasses.chatList}
                          itemLayout="horizontal"
                          dataSource={chats}
                          renderItem={(item, index) => (
                              <Flex gap={10}
                                    className={chatListClasses.chatWrapper}
                                    align={"center"}
                              >
                                  <List.Item style={{flex : 1}}  content={'43'}
                                             key={"chat-" + item.chat.id}
                                             onClick={() => onSelectChat(item.chat.id)}
                                  >
                                      <List.Item.Meta
                                          avatar={<Avatar size={"large"} src={item.chat.picture}/>}
                                          title={<span className={chatListClasses.chatTitle}>{item.chat.name}</span>}
                                          description={<span className={chatListClasses.chatDesc}>{item.chat.description}</span>}
                                      />
                                  </List.Item>
                                  <div>
                                      {selectedChatsToForward.includes(item.chat.id) &&
                                          <CheckOutlined style={{color : "green", fontSize : 20}}/>

                                      }
                                  </div>
                              </Flex>
                          )}
                    />
                </Flex>
            </Modal>
        </ConfigProvider>

    );
};

export default SelectChatModalToForwardMessages;