import React, {useContext, useEffect, useState} from 'react';
import {Flex} from "antd";
import '../ChatPage/ChatPage.css'
import {StompSessionProvider} from "react-stomp-hooks";
import ChatWindow from "../../../components/forum/ChatWindow/ChatWindow";
import {useActions} from "../../../hooks/useActions";
import {useParams} from "react-router-dom";
import {getChatById, getOrCreatePrivateChat} from "../../../API/services/forum/ChatService";
import {useAuth0} from "@auth0/auth0-react";
import {AuthContext} from "../../../context/AuthContext";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {IChat, PrivateChat} from "../../../API/services/forum/ForumInterfaces";
import ContentList from "../AllTopicsPage/ContentList/ContentList";
import WindowSlider from "../../../components/forum/WindowSlider/WindowSlider";
import forumPageClasses from "../AllTopicsPage/ForumPage.module.css";
import {setPrivateChatInfo} from "../../../store/actionCreators/chat";

const PrivateChatPage = () => {
    const {setChatId, setHasPreviousMessages} = useActions()
    const {receiverId} = useParams()
    const {user, isAuthenticated} = useAuth0()
    const {jwt} = useContext(AuthContext)
    const {chatId} = useTypedSelector(state => state.chat)
    const {setChatInfo, setPrivateChatInfo} = useActions()
    const [privateChat, setPrivateChat] = useState<PrivateChat>();
    const [leftPanelWidth, setLeftPanelWidth] = useState<number>(500)


    useEffect(() => {
        if (jwt && user?.sub && receiverId) {
            console.log("getPrivateChatId")
            getPrivateChatId(receiverId, user.sub, jwt)
        }
    }, [user?.sub, jwt, receiverId]);


    const initChat = async (chatId: number, privateChat : PrivateChat) => {
        console.log("initChat call!")
        const {data, error} = await getChatById(chatId);
        console.log("initChat data", data)
        if (data) {
            console.log("initChat, getChatById response", data)
            const chat : IChat = data;
            if (privateChat) {
                console.log("Private chat ", privateChat)
                chat.picture = privateChat.receiver.avatar
                    chat.name = privateChat.receiver.nickname
                // if (senderId === privateChat.sender.id.toString()) {
                //     chat.picture = privateChat.receiver.avatar
                //     chat.name = privateChat.receiver.nickname
                // }
                // if (senderId === privateChat.receiver.id.toString()) {
                //     chat.picture = privateChat.sender.avatar
                //     chat.name = privateChat.sender.nickname
                // }
            }
            setChatInfo(chat)
        }
        if (error) throw error;
    }

    useEffect(() => {
        if (chatId && privateChat) {
            if (chatId > 0) {

                console.log("INIT CHAT", chatId)
                initChat(chatId, privateChat)
            }
        }
    }, [chatId, privateChat]);

    const getPrivateChatId = async (user1_id : string, user2_id : string, jwt : string) => {
        const {data} = await getOrCreatePrivateChat(encodeURIComponent(user1_id), encodeURIComponent(user2_id), jwt)

        if (data) {
            const privateChat : PrivateChat = {
                receiver : data.user1,
                sender : data.user2,
                chat_id : data.chat_id
            };
            console.log("getPrivateChatId response",privateChat)
            setPrivateChatInfo(privateChat)
            setPrivateChat(privateChat)
            setChatId(privateChat.chat_id)
        }
    }


    useEffect(() => {
        setHasPreviousMessages(true)
    }, []);

    return (
        <Flex className={['chatPageWrapper',  forumPageClasses.forumBg].join(' ')}
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
                {isAuthenticated &&
                    // <StompSessionProvider url={'https://api.miloverada.gov.ua:8443/ws-endpoint'}>
                    <StompSessionProvider url={'http://localhost:6060/ws-endpoint'}>
                        <ChatWindow />
                    </StompSessionProvider>
                }

            </Flex>
        </Flex>
    );
};

export default PrivateChatPage;
