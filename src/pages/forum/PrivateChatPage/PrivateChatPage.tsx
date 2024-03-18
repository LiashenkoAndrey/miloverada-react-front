import React, {useContext, useEffect, useState} from 'react';
import {Flex} from "antd";
import {StompSessionProvider} from "react-stomp-hooks";
import ChatWindow from "../../../components/ChatWindow/ChatWindow";
import {useActions} from "../../../hooks/useActions";
import {useParams} from "react-router-dom";
import ChatNav from "../../../components/ChatNav";
import {getChatById, getOrCreatePrivateChat} from "../../../API/services/forum/ChatService";
import {useAuth0} from "@auth0/auth0-react";
import {AuthContext} from "../../../context/AuthContext";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {IChat, PrivateChat} from "../../../API/services/forum/ForumInterfaces";

const PrivateChatPage = () => {
    const {setChatId, setHasPreviousMessages} = useActions()
    const {user1_id} = useParams()
    const {user, isAuthenticated} = useAuth0()
    const {jwt} = useContext(AuthContext)
    const {chatId} = useTypedSelector(state => state.chat)
    const {setChatInfo} = useActions()
    const [privateChat, setPrivateChat] = useState<PrivateChat>();

    const initChat = async (chatId: number, privateChat : PrivateChat) => {
        const {data, error} = await getChatById(chatId);
        if (data) {
            const chat : IChat = data;
            if (privateChat) {
                if (user1_id === privateChat.user1.id) {
                    chat.picture = privateChat.user1.avatar
                    chat.name = privateChat.user1.firstName
                }
                if (user1_id === privateChat.user2.id) {
                    chat.picture = privateChat.user2.avatar
                    chat.name = privateChat.user2.firstName
                }
            }
            setChatInfo(chat)
        }
        if (error) throw error;
    }

    useEffect(() => {
        console.log(chatId, privateChat)
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
            const privateChat : PrivateChat = data;
            console.log(privateChat)
            setPrivateChat(privateChat)
            setChatId(privateChat.chat_id)
        }
    }

    useEffect(() => {

        if (user?.sub) {
            console.log("ok")
        }
        if (jwt && user?.sub && user1_id) {
            console.log("getPrivateChatId")
            getPrivateChatId(user1_id, user.sub, jwt)
        } else {
            console.error("is null", user1_id, user?.sub)
        }
    }, [user?.sub, jwt]);


    useEffect(() => {
        setHasPreviousMessages(true)
    }, []);

    return (
        <Flex className={"chatPageWrapper"} align={"flex-start"} justify={"center"}>
            <Flex className={"chatWrapper"} gap={20} justify={"center"}>
                <ChatNav/>

                {isAuthenticated &&
                    <StompSessionProvider url={'https://v2.miloverada.gov.ua:8443/ws-endpoint'}>
                        <ChatWindow />
                    </StompSessionProvider>
                }

            </Flex>
        </Flex>
    );
};

export default PrivateChatPage;