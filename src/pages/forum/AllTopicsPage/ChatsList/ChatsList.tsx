import React, {FC} from 'react';
import {Avatar, Flex, Image, Segmented} from "antd";
import classes from "../AllForumTopicsPage.module.css";
import {Chat} from "../../../../API/services/forum/ForumInterfaces";
import {createSearchParams, useNavigate} from "react-router-dom";
import {PlusCircleTwoTone, UnorderedListOutlined, WechatOutlined} from "@ant-design/icons";
import TopicsList from "../TopicsList/TopicsList";
import StoriesList from "../../../../components/forum/StoriesList/StoriesList";

interface ChatsListProps {
}

const ChatsList: FC<ChatsListProps> = () => {
    const nav = useNavigate()

    return (
        <Flex className={classes.TopicsList} vertical>
            <Flex vertical>
                <Flex style={{width: "100%"}} justify={"space-between"} >
                    <StoriesList/>
                    <Segmented style={{backgroundColor: "#191a24"}}
                               options={[
                                   {
                                       label: (
                                           <div style={{ padding: 4 }}>
                                               <WechatOutlined style={{color: "#B1B8BEFF"}} />
                                               <div style={{color: "#B1B8BEFF"}} >Чати</div>
                                           </div>
                                       ),
                                       value: 'user1',

                                   },
                                   {
                                       label: (
                                           <div  style={{ padding: 4 , color: "#B1B8BEFF"}}>
                                               <UnorderedListOutlined />
                                               <div>Теми</div>
                                           </div>
                                       ),
                                       value: 'user2',
                                   },

                               ]}
                    />
                </Flex>
                <TopicsList />
            </Flex>
        </Flex>
    )
};

export default ChatsList;