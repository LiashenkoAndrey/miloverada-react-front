import React, {useContext, useEffect} from 'react';
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {useActions} from "../../../hooks/useActions";
import {getUserVisitedChats} from "../../../API/services/forum/ChatService";
import {AuthContext} from "../../../context/AuthContext";
import {useAuth0} from "@auth0/auth0-react";
import {Avatar, Empty, Flex, List} from "antd";
import classes from './ChatList.module.css'
import {createSearchParams, useLocation, useNavigate} from "react-router-dom";
import ChatImage from "../../ChatImage/ChatImage";

export enum Modes {
    CHATS = "CHATS",
    POSTS = "POSTS",
    TOPICS = "TOPICS"
}

const ChatsList = () => {
    const {chats} = useTypedSelector(state => state.forum)
    const {setChats} = useActions()
    const {user} = useAuth0()
    const {jwt} = useContext(AuthContext)
    const nav = useNavigate();
    const location = useLocation()
    const {setChatInfo} = useActions()
    const getAll = async () => {
        if (jwt && user?.sub) {
            const {data} = await getUserVisitedChats(decodeURIComponent(user.sub), jwt)
            if (data) {
                setChats(data)
            }

        } else console.log("not auth")
    }

    const onSelectChat = (chatId: number, topicId?: number) => {
        const params = createSearchParams(topicId ? {topicId: String(topicId)} : {}).toString()
        nav({
            pathname: `/forum/chat/` + chatId,
            search: params
        })
        if (location.pathname.includes("/chat/")) {
            console.log("SET NULL")
            setChatInfo(null)
        }
    }

    useEffect(() => {
        getAll()
    }, [jwt]);

    return chats.length > 0  ?
        (
        <List key={"chatList-" }

              className={classes.chatList}
              header={<span className={classes.name}>Мої чати</span>}
              itemLayout="horizontal"
              dataSource={chats}
              renderItem={(item, index) => (
                  <List.Item className={classes.chatWrapper} key={"chat-" + item.chat.id}
                             onClick={() => onSelectChat(item.chat.id)}
                  >
                      <List.Item.Meta
                          avatar={<ChatImage image={item.chat.picture} chatName={item.chat.name}/>}
                          title={<span className={classes.chatTitle}>{item.chat.name}</span>}
                          description={<span className={classes.chatDesc}>{item.chat.description}</span>}
                      />
                      {item.chatMetadata.unread_messages_count > 0 &&
                          <span className={classes.unreadMessagesCount}>{item.chatMetadata.unread_messages_count}</span>

                      }
                  </List.Item>
              )}
        />
    ) :
        <Flex justify={'center'}  style={{width: "100%", height : '100%', backgroundColor : "var(--forum-primary-bg-color)", paddingTop : "5vh"}} >
            <Empty description={<p style={{color: 'white'}}>Почніть новий чат!</p>} />;

        </Flex>
};

export default ChatsList;