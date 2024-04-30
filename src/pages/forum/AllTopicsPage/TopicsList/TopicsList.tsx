import React, {FC, useEffect, useState} from 'react';
import {Avatar, Button, Empty, Flex, List, Skeleton} from "antd";
import {Topic} from "../../../../API/services/forum/ForumInterfaces";
import {createSearchParams, useNavigate} from "react-router-dom";
import classes from './TopicList.module.css'
import {getAllTopics} from "../../../../API/services/forum/TopicService";
import {MessageOutlined, PlusOutlined, UserOutlined} from "@ant-design/icons";
import NewChatModal from '../../../../components/NewChatModal';
import ChatImage from "../../../../components/ChatImage/ChatImage";
import {useTypedSelector} from "../../../../hooks/useTypedSelector";
import {useActions} from "../../../../hooks/useActions";

interface TopicsListProps {
}

export type TopicInfo ={
    topicId? : number, topicName? : string
}


const TopicsList: FC<TopicsListProps> = () => {
    const {topics} = useTypedSelector(state => state.forum)
    const nav = useNavigate();
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

    const onChatCreateBtnClick = (topicId? : number, name? : string) => {
        topicInfo.topicId = topicId
        topicInfo.topicName = name
        setTopicInfo(topicInfo)
        setIsNewChatModalOpen(true)
    }

    return (
        <Flex vertical className={classes.topicWrapper}>
            {topics?.length > 0
                ?
                topics.map((topic) =>
                    <Flex style={{padding: "10px 10px", marginBottom : 10, backgroundColor : "rgba(255,255,255,0.07)"}} vertical>
                        <Flex style={{paddingBottom: 5}} gap={10}>
                            <Button onClick={() => onChatCreateBtnClick(topic.id, topic.name)} ghost icon={<PlusOutlined/>}/>

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

                                          <span className={classes.messagesAmount}>{chat.totalMessagesAmount} повід. <UserOutlined /> 3</span>
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
                    <p>Жодної теми для обговорення ще стоворили</p>
                    <p>Станьте першими!</p>
                    <div>
                        <Button style={{width: 'fit-content'}}>Нова тема</Button>
                    </div>
                </Flex>
            }
            <NewChatModal isOpen={isNewChatModalOpen} setIsOpen={setIsNewChatModalOpen} topicInfo={topicInfo}/>

        </Flex>
    );
};

export default TopicsList;