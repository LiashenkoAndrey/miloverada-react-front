import React, {FC, useEffect, useState} from 'react';
import {Button, Flex, List} from "antd";
import {createSearchParams, useLocation, useNavigate} from "react-router-dom";
import classes from './TopicList.module.css'
import {getAllTopics} from "../../../../API/services/forum/TopicService";
import {PlusOutlined, UserOutlined} from "@ant-design/icons";
import NewChatModal from '../../../../components/forum/NewChatModal';
import ChatImage from "../../../../components/forum/ChatImage/ChatImage";
import {useTypedSelector} from "../../../../hooks/useTypedSelector";
import {useActions} from "../../../../hooks/useActions";
import {useAuth0} from "@auth0/auth0-react";

interface TopicsListProps {
}

export type TopicInfo = {
    topicId?: number, topicName?: string
}


const TopicsList: FC<TopicsListProps> = () => {
    const {pathname} = useLocation();
    const {topics} = useTypedSelector(state => state.forum)
    const nav = useNavigate();
    const {isAuthenticated} = useAuth0()
    const {setTopics} = useActions()

    const getTopics = async () => {
        const {data, error} = await getAllTopics();
        if (data) {
            setTopics(data)
        }
        if (error) throw error;
    }

    useEffect(() => {
        getTopics()
    }, []);

    const onSelectChat = (chatId: number, topicId: number | undefined) => {
        const params = createSearchParams({topicId: String(topicId)}).toString()
        nav({
            pathname: "/forum/chat/" + chatId,
            search: params
        })
    }
    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState<boolean>(false)
    const [topicInfo, setTopicInfo] = useState<TopicInfo>({})

    const onChatCreateBtnClick = (topicId?: number, name?: string) => {
        topicInfo.topicId = topicId
        topicInfo.topicName = name
        setTopicInfo(topicInfo)
        setIsNewChatModalOpen(true)
    }

    useEffect(() => {
        console.log(pathname.includes("chat"))
    }, []);

    return (
        <Flex vertical className={classes.topicWrapper}>
            {topics?.length > 0
                ?
                topics.map((topic, index) =>
                    <Flex key={"topicsListItem-" + index } style={{padding: "10px 10px", marginBottom: 10, backgroundColor: "rgba(255,255,255,0.07)"}}
                          vertical>
                        <Flex style={{paddingBottom: 5}} gap={10}>
                            {(isAuthenticated && !pathname.includes("chat")) &&
                                <Button onClick={() => onChatCreateBtnClick(topic.id, topic.name)}
                                        ghost
                                        style={{padding: 5}}
                                        icon={<PlusOutlined/>}
                                />
                            }

                            <span className={classes.topicName} style={{color: "#B1B8BEFF"}}>
                                {topic.name} {topic.description}
                            </span>
                        </Flex>
                        {topic.chats && topic.chats.length > 0 &&
                            <List key={"topicList-" + topic.id} className={classes.topicWrapper}
                                  style={{backgroundColor: "#191a24"}}
                                  itemLayout="horizontal"
                                  dataSource={topic.chats}
                                  renderItem={(chat, index) => (
                                      <List.Item onClick={() => onSelectChat(chat.id, topic.id)}
                                                 key={"topic-" + chat.id}
                                                 className={classes.chatWrapper}
                                      >
                                          <List.Item.Meta
                                              avatar={<ChatImage image={chat.picture} chatName={chat.name}/>}
                                              title={
                                                  <span
                                                      className={classes.chatName}>
                                            {chat.name}
                                        </span>
                                              }
                                              description={<span className={classes.chatDesc}>{chat.description}</span>}
                                          />

                                          {chat.totalMessagesAmount > 0 &&
                                              <span className={classes.messagesAmount}>
                                                  {chat.totalMessagesAmount} повід. <UserOutlined/> {chat.totalMembersAmount}
                                              </span>
                                          }
                                      </List.Item>
                                  )}
                            />
                        }

                    </Flex>
                )
                :
                <Flex
                    vertical
                    gap={4}
                    className={classes.topicPlaceholderWrapper}
                >
                    <p>Жодної теми для обговорення ще не стоворили</p>
                    <p>Станьте першими!</p>
                </Flex>
            }
            <NewChatModal isOpen={isNewChatModalOpen} setIsOpen={setIsNewChatModalOpen} topicInfo={topicInfo}/>

        </Flex>
    );
};

export default TopicsList;
