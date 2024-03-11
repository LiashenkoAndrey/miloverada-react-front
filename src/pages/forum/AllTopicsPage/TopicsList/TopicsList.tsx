import React, {FC, useEffect, useState} from 'react';
import {Avatar, Empty, Flex, List} from "antd";
import {Topic} from "../../../../API/services/forum/ForumInterfaces";
import {createSearchParams, useNavigate} from "react-router-dom";
import './TopicList.css'
import {getAllTopics} from "../../../../API/services/forum/TopicService";

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
            pathname: "/chat/" + chatId,
            search: params
        })
    }


    return (
        <>
            {topics?.length > 0
                ?
                topics.map((topic) =>

                    <List key={"topicList-" + topic.id}
                        header={
                            <span className={"topicName"} style={{color: "#B1B8BEFF"}}
                                  onClick={() => nav("/topic/" + topic.id)}>
                                    {topic.name}:
                                </span>
                        }
                        style={{backgroundColor: "#191a24"}}
                        itemLayout="horizontal"
                        dataSource={topic.chats}
                        renderItem={(item, index) => (
                            <List.Item key={"topic-" + item.id} style={{marginLeft: 20}}>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.picture}/>}
                                    title={
                                        <span
                                            style={{color: "#B1B8BEFF", textDecoration: "underline", cursor: "pointer"}}
                                            onClick={() => onSelectChat(item.id, topic.id)}>
                                            {item.name}
                                        </span>
                                    }
                                    description={<span style={{color: "#B1B8BEFF"}}>{item.description}</span>}
                                />
                            </List.Item>
                        )}
                    />
                )
                :
                <Flex justify={"center"} style={{width: "40vw"}}>
                    <Empty description={<span style={{color: "white"}}>Немає тем</span>}/>
                </Flex>
            }
        </>
    );
};

export default TopicsList;