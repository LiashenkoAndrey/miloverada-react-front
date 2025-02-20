import React, {useContext, useEffect, useState} from 'react';
import {Flex} from "antd";
import './ChatPage.css'
import {useParams} from "react-router-dom";
import ChatWindow from "../../../components/forum/ChatWindow/ChatWindow";
import {StompSessionProvider} from "react-stomp-hooks";
import {useActions} from "../../../hooks/useActions";
import {getChatById, getOrCreatePrivateChat} from "../../../API/services/forum/ChatService";
import classes from "../AllTopicsPage/ForumPage.module.css";
import ContentList from "../AllTopicsPage/ContentList/ContentList";
import {useAuth0} from "@auth0/auth0-react";
import WindowSlider from "../../../components/forum/WindowSlider/WindowSlider";
import {AuthContext} from "../../../context/AuthContext";
import {PrivateChat} from "../../../API/services/forum/ForumInterfaces";
import {useTypedSelector} from "../../../hooks/useTypedSelector";

const ChatPage = () => {
    const {setChatId, setHasPreviousMessages} = useActions()
    const {id, userId} = useParams()
    const {isLoading, user} = useAuth0()
    const [leftPanelWidth, setLeftPanelWidth] = useState<number>(500)
    const {setChatInfo, setPrivateChatInfo} = useActions()
    const {jwt} = useContext(AuthContext)
    const {chatId} = useTypedSelector(state => state.chat)

    const initChat = async (chatId: number, id? : string) => {
        console.log("Init chat, ", chatId)
        const {data, error} = await getChatById(chatId, id);
        if (data) {
            setChatInfo(data)
        }
        if (error) throw error;
    }

    const getPrivateChat = async (jwt : string,  user1_id : string,  user2_id : string) => {
        const {data} = await getOrCreatePrivateChat(encodeURIComponent(user1_id), encodeURIComponent(user2_id), jwt)
        if (data) {
            const privateChat : PrivateChat = data;
            console.log(privateChat)
            setChatId(privateChat.chat_id)
            setPrivateChatInfo(privateChat)
        }
    }

    useEffect(() => {
        if (jwt && userId && user?.sub) {
            console.log("chat with user " + userId)
            getPrivateChat(jwt, user.sub, userId)
        } else {
            console.log("bug", jwt, userId, user)
        }
    }, [userId, user, jwt]);

    useEffect(() => {
        if (!isLoading && (id || chatId)) {
            console.log("param", id, "private chat id", chatId)
            const  encodedUserId = user?.sub && encodeURIComponent(user.sub)

            if (id) {
                const chatIdNum = Number(id)
                console.log(chatIdNum, id)
                if (chatIdNum !== chatId) {

                    setHasPreviousMessages(true)
                    setChatId(chatIdNum)
                    setPrivateChatInfo(null)
                    initChat(chatIdNum, encodedUserId)
                } else {
                    console.log("Skip chat loading")
                }
            }
            if (chatId !== -1) {
                console.log("else chat ID", chatId)
                initChat(chatId, encodedUserId)
            }
        } else {
            console.log("Chat id not present")
        }

    }, [isLoading, user?.sub, id, chatId]);


    return (
        <Flex  className={['chatPageWrapper',  classes.forumBg].join(' ')}
               align={"flex-start"}
               justify={"center"}
        >
            <Flex className={"chatWrapper"}
                  justify={"center"}
            >
                <Flex className={"leftContent forumStyledScrollBar"}
                      style={{overflowY: "scroll", height: "100vh", width: leftPanelWidth}}
                >
                    <ContentList/>
                </Flex>

                <WindowSlider leftPanelWidth={leftPanelWidth}
                              setLeftPanelWidth={setLeftPanelWidth}
                />

                <StompSessionProvider url={process.env.REACT_APP_API_WS_HANDSHAKE_ENDPOINT!}>
                    <ChatWindow />
                </StompSessionProvider>
            </Flex>
        </Flex>
    );
};

export default ChatPage;
