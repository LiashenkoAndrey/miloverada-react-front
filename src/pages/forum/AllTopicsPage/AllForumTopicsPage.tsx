import React, {useEffect, useState} from 'react';
import {Flex} from "antd";
import {Topic} from "../../../API/services/forum/ForumInterfaces";
import {getAllTopics} from "../../../API/services/forum/TopicService";
import LatestMessagesList from "./LatestMessagesList/LatestMessagesList";
import TopicsList from "./TopicsList/TopicsList";
import {useAuth0} from "@auth0/auth0-react";
import NewTopic from "../../../components/NewTopic";
import ForumNavbar from "../../../components/ForumNavbar/ForumNavbar";

const AllForumTopicsPage = () => {
    const [topics, setTopics] = useState<Array<Topic>>([]);
    const {isAuthenticated } = useAuth0()

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


    return (
        <Flex align={"flex-start"} justify={"center"}
              style={{paddingTop: "16vh", minHeight: "100vh", backgroundColor: "var(--forum-primary-bg-color)"}}>
            <Flex style={{maxWidth: "80vw", width: "100%"}} gap={10} justify={"center"}>
                <ForumNavbar>
                    <Flex vertical>
                        <span style={{color: "black", fontSize: 20, marginBottom: 5}}>Теми</span>
                        <NewTopic getTopics={getTopics} isAuth={isAuthenticated}/>
                    </Flex>
                </ForumNavbar>
                <Flex vertical style={{width: "inherit", maxWidth: "40vw"}}>
                    <h1 style={{color: "var(--forum-primary-title-color)", marginTop: 0}}>Форум</h1>
                    <Flex gap={13} vertical>
                        <TopicsList  topics={topics}/>
                    </Flex>
                </Flex>

                <LatestMessagesList />
            </Flex>
        </Flex>
    );
};

export default AllForumTopicsPage;