import React, {useEffect, useState} from 'react';
import {Avatar, ConfigProvider, Flex, Segmented, Skeleton, Statistic} from "antd";
import {Topic} from "../../../API/services/forum/ForumInterfaces";
import {getAllTopics} from "../../../API/services/forum/TopicService";
import LatestMessagesList from "./LatestMessagesList/LatestMessagesList";
import TopicsList from "./TopicsList/TopicsList";
import {useAuth0} from "@auth0/auth0-react";
import NewTopic from "../../../components/NewTopic";
import ForumNavbar from "../../../components/ForumNavbar/ForumNavbar";
import classes from './AllForumTopicsPage.module.css'
import {getActiveUsersAmount} from "../../../API/services/forum/UserService";
import locale from "antd/es/locale/uk_UA";
import {UnorderedListOutlined, WechatOutlined} from "@ant-design/icons";
import ChatsList from "./ChatsList/ChatsList";

const AllForumTopicsPage = () => {

    const [activeUsersAmount, setActiveUsersAmount] = useState<number>()
    const {isAuthenticated } = useAuth0()

    const getUsersAmount = async () => {
        const {data, error} = await getActiveUsersAmount();
        if (data) {
            setActiveUsersAmount(data)
        }
        if (error) throw error;
    }

    useEffect(() => {
        getUsersAmount()
    }, []);


    return (
        <ConfigProvider  theme={{
            token : {
                colorPrimary: '#191a24',
            },
            components: {
                Segmented: {
                    itemSelectedBg : "rgba(94,94,107,0.46)",
                }
            }
        }}>
            <Flex wrap={"wrap"}
                  align={"flex-start"}
                  justify={"center"}
                  className={[classes.wrapper,  classes.forumBg].join(' ')}
            >
                <Flex wrap={"wrap"}
                      className={classes.pageWrapper}
                      gap={10}
                      justify={"center"}
                >
                    <ForumNavbar>
                        <Flex vertical>
                            <span  style={{color: "black", fontSize: 20, marginBottom: 5}}>Теми</span>
                            <NewTopic isAuth={isAuthenticated}/>
                        </Flex>
                    </ForumNavbar>
                    <ChatsList/>

                </Flex>
            </Flex>
        </ConfigProvider>

    );
};

export default AllForumTopicsPage;