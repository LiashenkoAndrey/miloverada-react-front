import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import ForumWrapper from "../../../components/ForumWrapper/ForumWrapper";
import {Topic} from "../../../API/services/forum/ForumInterfaces";
import {getTopicById} from "../../../API/services/forum/TopicService";
import ForumNavbar from "../../../components/ForumNavbar/ForumNavbar";
import {Button, Flex} from "antd";
import ContentList from "../AllTopicsPage/ContentList/ContentList";
import {LeftOutlined} from "@ant-design/icons";
import './TopicPage.css'
import NewChatModal from "../../../components/NewChatModal";

const TopicPage = () => {


    const {id} = useParams()
    const [topic, setTopic] = useState<Topic>()
    const nav = useNavigate()

    useEffect(() => {
        const getTopic = async () => {
            const {data, error} = await getTopicById(Number(id));
            if (data) {
                setTopic(data)
            }
            if (error) throw new Error("getTopicById error")
        }
        getTopic()
    }, []);

    return (
        <ForumWrapper style={{maxWidth: "90vw", width: "100%", color: "white"}}>
            <Flex vertical>
                <Button onClick={() => nav(-1)}
                        style={{maxWidth: 150, color: "white"}}
                        icon={<LeftOutlined/>}
                        type={"text"}>
                    Назад
                </Button>
                <ForumNavbar>

                </ForumNavbar>
            </Flex>

            <Flex vertical style={{width: "inherit", maxWidth: 900}}>
                <Flex  style={{width: "inherit", height: "fit-content"}} align={"center"} justify={"space-between"}>

                    <Flex gap={5}>
                        <h3>{topic?.name}</h3>
                        <h3>{topic?.description}</h3>
                    </Flex>

                    <NewChatModal topicId={Number(id)}/>

                </Flex>

                <Flex className={"topicPageChatListWrapper"}>
                    <div>2</div>
                    <div>3</div>
                    <div>4</div>
                </Flex>
                {/*{topic && <ContentList chats={topic.chats} topicId={topic.id}/>}*/}
            </Flex>
        </ForumWrapper>
    );
};

export default TopicPage;