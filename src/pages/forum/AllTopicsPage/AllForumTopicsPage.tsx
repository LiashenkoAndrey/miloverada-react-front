import React, {useEffect, useState} from 'react';
import {Col, Flex, Skeleton, Statistic} from "antd";
import {Topic} from "../../../API/services/forum/ForumInterfaces";
import {getAllTopics} from "../../../API/services/forum/TopicService";
import LatestMessagesList from "./LatestMessagesList/LatestMessagesList";
import TopicsList from "./TopicsList/TopicsList";
import {useAuth0} from "@auth0/auth0-react";
import NewTopic from "../../../components/NewTopic";
import ForumNavbar from "../../../components/ForumNavbar/ForumNavbar";
import classes from './AllForumTopicsPage.module.css'
import {getActiveUsersAmount} from "../../../API/services/forum/UserService";

const AllForumTopicsPage = () => {
    const [topics, setTopics] = useState<Array<Topic>>([]);
    const [activeUsersAmount, setActiveUsersAmount] = useState<number>()
    const {isAuthenticated } = useAuth0()

    const getTopics = async () => {
        const {data, error} = await getAllTopics();
        if (data) {
            setTopics(data)
        }
        if (error) throw error;
    }

    const getUsersAmount = async () => {
        const {data, error} = await getActiveUsersAmount();
        if (data) {
            setActiveUsersAmount(data)
        }
        if (error) throw error;
    }

    useEffect(() => {
        getTopics()
        getUsersAmount()
    }, []);


    return (
        <Flex wrap={"wrap"} align={"flex-start"} justify={"center"}
              style={{paddingTop: "5vh", minHeight: "100vh", backgroundColor: "var(--forum-primary-bg-color)", paddingBottom: "15vh"}}>
            <Flex wrap={"wrap"} className={classes.pageWrapper} gap={10} justify={"center"}>
                <ForumNavbar>
                    <Flex vertical>
                        <span style={{color: "black", fontSize: 20, marginBottom: 5}}>Теми</span>
                        <NewTopic getTopics={getTopics} isAuth={isAuthenticated}/>
                    </Flex>
                </ForumNavbar>
                <Flex className={classes.TopicsList} vertical>
                    <h1 style={{color: "var(--forum-primary-title-color)", marginTop: 0}}>Форум</h1>
                    <Flex gap={13} vertical>
                        <TopicsList  topics={topics}/>
                    </Flex>
                </Flex>

                <Flex className={classes.infoBar} vertical>

                    <LatestMessagesList />

                    {activeUsersAmount
                        ?
                        <Statistic style={{padding : 15}} title="Активних користувачів" value={activeUsersAmount} />
                        :
                        <Skeleton active/>
                    }
                </Flex>
            </Flex>
        </Flex>
    );
};

export default AllForumTopicsPage;