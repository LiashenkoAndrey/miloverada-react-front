import React, {FC} from 'react';
import {Empty, Flex} from "antd";
import classes from "../AllForumTopicsPage.module.css";
import ChatsList from "../ChatsList/ChatsList";
import {Topic} from "../../../../API/services/forum/ForumInterfaces";
import {useNavigate} from "react-router-dom";
import './TopicList.css'

interface TopicsListProps {
    topics : Array<Topic>
}

const TopicsList: FC<TopicsListProps> = ({topics}) => {

    const nav = useNavigate();

    return (
        <>
            {topics?.length > 0
                ?
                topics.map((topic) =>
                    <Flex key={"topic-" + topic.id} vertical gap={2}>
                        <Flex className={classes.topic} gap={20}

                              align={"center"}
                        >
                            <span className={"topicName"} onClick={() => nav("/topic/" + topic.id)}>
                                {topic.name}:
                            </span>
                            <span style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: "#282A3E"
                            }}>
                                {topic.description}
                            </span>
                        </Flex>

                        <ChatsList chats={topic.chats} topicId={topic.id}/>
                    </Flex>
                )
                :
                <Flex justify={"center"} style={{width: "40vw"}}>
                    <Empty  description={<span style={{color : "white"}}>Немає тем</span>}/>
                </Flex>
            }
        </>
    );
};

export default TopicsList;