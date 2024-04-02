import React, {FC, useEffect, useState} from 'react';
import {Avatar, Empty, Flex, List} from "antd";
import {Topic} from "../../../../API/services/forum/ForumInterfaces";
import {createSearchParams, useNavigate} from "react-router-dom";
import classes from './TopicList.module.css'
import {getAllTopics} from "../../../../API/services/forum/TopicService";
import {MessageOutlined, UserOutlined} from "@ant-design/icons";

interface TopicsListProps {
}

const TopicsList: FC<TopicsListProps> = () => {
    const [topics, setTopics] = useState<Array<Topic>>([]);
    const nav = useNavigate();

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


    return (
        <>
            {topics?.length > 0
                ?
                topics.map((topic) =>

                    <List key={"topicList-" + topic.id} className={classes.topicWrapper}
                        header={
                            <span className={classes.topicName} style={{color: "#B1B8BEFF"}}
                                  onClick={() => nav("/topic/" + topic.id)}>
                                    {topic.name}:
                                </span>
                        }
                        style={{backgroundColor: "#191a24"}}
                        itemLayout="horizontal"
                        dataSource={topic.chats}
                        renderItem={(item, index) => (
                            <List.Item onClick={() => onSelectChat(item.id, topic.id)} key={"topic-" + item.id} className={classes.chatWrapper} >
                                <List.Item.Meta
                                    avatar={<Avatar size={"large"} src={item.picture}/>}
                                    title={
                                        <span
                                            className={classes.chatName}>
                                            {item.name}
                                        </span>
                                    }
                                    description={<span className={classes.chatDesc}>{item.description}</span>}
                                />
                                {/*<Flex gap={5}>*/}
                                {/*    <UserOutlined />*/}
                                {/*    <span className={classes.messagesAmount}>2</span>*/}
                                {/*</Flex>*/}
                                {/*<Flex gap={5}>*/}
                                {/*    <MessageOutlined />*/}
                                {/*    <span className={classes.messagesAmount}>234</span>*/}

                                {/*</Flex>*/}
                                <span className={classes.messagesAmount}>234 повід. <UserOutlined /> 3</span>
                            </List.Item>
                        )}
                    />
                )
                :
                <h1>werwerwerwerwerwer</h1>
                // <Flex justify={"center"} style={{width: "40vw"}}>
                //     <Empty description={<span style={{color: "white"}}>Немає тем</span>}/>
                // </Flex>
            }
        </>
    );
};

export default TopicsList;