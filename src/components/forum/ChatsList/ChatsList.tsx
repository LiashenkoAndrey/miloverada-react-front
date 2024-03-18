import React, {useContext, useEffect} from 'react';
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {useActions} from "../../../hooks/useActions";
import {getUserVisitedChats} from "../../../API/services/forum/ChatService";
import {AuthContext} from "../../../context/AuthContext";
import {useAuth0} from "@auth0/auth0-react";
import {Avatar, List} from "antd";
import classes from './ChatList.module.css'
import {createSearchParams, useLocation, useNavigate} from "react-router-dom";

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

    return (
        <List key={"chatList-" }
              className={classes.chatList}
              header={
                  <span className={classes.name} style={{color: "#B1B8BEFF"}}>
                                    Мої чати
                                </span>
              }
              style={{backgroundColor: "#191a24", height: "100%"}}
              itemLayout="horizontal"
              dataSource={chats}
              renderItem={(item, index) => (
                  <List.Item className={classes.chatWrapper} key={"chat-" + item.chat.id}
                             style={{paddingLeft: 10}}
                             onClick={() => onSelectChat(item.chat.id)}
                  >
                      <List.Item.Meta
                          avatar={<Avatar size={"large"} src={item.chat.picture}/>}
                          title={
                              <span
                                  style={{color: "#B1B8BEFF", textDecoration: "underline", cursor: "pointer"}}>
                                            {item.chat.name}
                                        </span>
                          }
                          description={<span style={{color: "#B1B8BEFF"}}>{item.chat.description}</span>}
                      />
                      {item.chatMetadata.unread_messages_count > 0 &&
                          <span className={classes.unreadMessagesCount}>{item.chatMetadata.unread_messages_count}</span>

                      }
                  </List.Item>
              )}
        />
    );
};

export default ChatsList;