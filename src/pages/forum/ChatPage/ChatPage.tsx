import React, {useEffect, useState} from 'react';
import {Flex} from "antd";
import './ChatPage.css'
import {useParams} from "react-router-dom";
import ChatWindow from "../../../components/ChatWindow/ChatWindow";
import {StompSessionProvider} from "react-stomp-hooks";
import {useActions} from "../../../hooks/useActions";
import ChatNav from "../../../components/ChatNav";
import {Chat} from "../../../API/services/forum/ForumInterfaces";
import {getChatById} from "../../../API/services/forum/ChatService";
import classes from "../AllTopicsPage/AllForumTopicsPage.module.css";
import ChatsList from "../AllTopicsPage/ChatsList/ChatsList";


const ChatPage = () => {
    const {setChatId, setHasPreviousMessages} = useActions()
    const {id} = useParams()
    const [chat, setChat] = useState<Chat>();

    const initChat = async (chatId: number) => {
        const {data, error} = await getChatById(chatId);
        if (data) {
            setChat(data)
        }
        if (error) throw error;
    }
    useEffect(() => {
        setHasPreviousMessages(true)
        setChatId(Number(id))
        initChat(Number(id))
    }, []);

    return (
        <Flex  className={['chatPageWrapper',  classes.forumBg].join(' ')} align={"flex-start"} justify={"center"}>
            <Flex className={"chatWrapper"}  justify={"center"}>
                {/*<Flex></Flex>*/}
                {/*<ChatNav/>*/}
                <Flex style={{order: 0, marginTop: 10}}>
                    <ChatsList/>
                </Flex>
                <Flex>
                    1
                </Flex>

                <StompSessionProvider url={'http://localhost:6060/ws-endpoint'}>
                    <ChatWindow chat={chat}/>
                </StompSessionProvider>
            </Flex>
        </Flex>
    );
};

export default ChatPage;