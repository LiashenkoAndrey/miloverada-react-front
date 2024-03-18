import React, {useEffect, useState} from 'react';
import {Flex} from "antd";
import './ChatPage.css'
import {useParams} from "react-router-dom";
import ChatWindow from "../../../components/ChatWindow/ChatWindow";
import {StompSessionProvider} from "react-stomp-hooks";
import {useActions} from "../../../hooks/useActions";
import {getChatById} from "../../../API/services/forum/ChatService";
import classes from "../AllTopicsPage/AllForumTopicsPage.module.css";
import ContentList from "../AllTopicsPage/ContentList/ContentList";
import {useAuth0} from "@auth0/auth0-react";
import WindowSlider from "../../../components/WindowSlider/WindowSlider";

const ChatPage = () => {
    const {setChatId, setHasPreviousMessages} = useActions()
    const {id} = useParams()
    const {isLoading, user} = useAuth0()
    const [leftPanelWidth, setLeftPanelWidth] = useState<number>(500)
    const {setChatInfo} = useActions()

    const initChat = async (chatId: number, userId? : string) => {
        const {data, error} = await getChatById(chatId, userId);
        if (data) {
            setChatInfo(data)
        }
        if (error) throw error;
    }

    useEffect(() => {
        if (!isLoading) {
            if (user?.sub) {
                initChat(Number(id), encodeURIComponent(user.sub))
            } else {
                initChat(Number(id))
            }
        }

    }, [isLoading, user?.sub, id]);

    useEffect(() => {
        setHasPreviousMessages(true)
        setChatId(Number(id))
    }, [id]);

    return (
        <Flex  className={['chatPageWrapper',  classes.forumBg].join(' ')}
               align={"flex-start"}
               justify={"center"}
        >
            <Flex className={"chatWrapper"}
                  justify={"center"}
            >
                <Flex className={"leftContent"}
                      style={{overflowY: "scroll", height: "100vh", width: leftPanelWidth}}
                >
                    <ContentList/>
                </Flex>

                <WindowSlider leftPanelWidth={leftPanelWidth}
                              setLeftPanelWidth={setLeftPanelWidth}
                />

                <StompSessionProvider url={'http://localhost:6060/ws-endpoint'}>
                    <ChatWindow />
                </StompSessionProvider>
            </Flex>
        </Flex>
    );
};

export default ChatPage;