import React, {useEffect, useState} from 'react';
import {Button, Empty, Flex, Image} from "antd";
import {Message, Topic} from "../../../API/services/forum/ForumInterfaces";
import {getAllTopics} from "../../../API/services/forum/TopicService";
import {WechatOutlined} from "@ant-design/icons";
import classes from './AllForumTopicsPage.module.css'
import {useNavigate, createSearchParams} from "react-router-dom";
import {getLatestMessages} from "../../../API/services/forum/MessageService";
import {toTime} from "../../../API/Util";

const AllForumTopicsPage = () => {

    const [topics, setTopics] = useState<Array<Topic>>([]);
    const [latestMessages, setLatestMessages] = useState<Array<Message>>([]);
    const nav = useNavigate()
    useEffect(() => {
        const getTopics = async () => {
            const {data, error} = await getAllTopics();
            if (data) {
                console.log(data)
                setTopics(data)
            }
            if (error) throw error;
        }

        getTopics()
    }, []);

    useEffect(() => {
        const getMessages = async () => {
            const {data, error} = await getLatestMessages();
            if (data) {
                console.log(data)
                setLatestMessages(data)
            }
            if (error) throw error;
        }
        getMessages()
    }, []);

    const onSelectChat = (chatId : number, topicId : number | undefined) => {
        const params = createSearchParams({topicId: String(topicId)}).toString()
        nav({
                pathname: "/chat/" + chatId,
                search : params
        })
    }

    return (
        <Flex align={"flex-start"} justify={"center"}
              style={{paddingTop: "20vh", minHeight: "100vh", backgroundColor: "#1F2232"}}>
            <Flex style={{maxWidth: "80vw", width: "100%"}} gap={20} justify={"center"}>

                <Flex vertical gap={10}>
                    <h1 style={{color: "#E6E7EF"}}>Форум</h1>
                    {topics
                        ?
                        topics.map((topic) =>
                            <Flex vertical gap={2}>
                                <Flex className={classes.topic} gap={20}
                                      style={{backgroundColor: "#A7ACC8", padding: 5, borderRadius: 5}}>
                                    <span
                                        style={{fontSize: 18, fontWeight: 900, color: "#282A3E"}}> {topic.name}:</span>
                                    <span style={{
                                        fontSize: 16,
                                        fontWeight: 700,
                                        color: "#282A3E"
                                    }}>{topic.description}</span>
                                </Flex>

                                {topic.chats
                                    ?
                                    topic.chats.map((chat) =>
                                        <Flex onClick={() => onSelectChat(chat.id, topic.id)}
                                              className={classes.chat}
                                              gap={20}
                                              justify={"space-between"}
                                              align={"center"}
                                        >
                                            <Flex gap={15} align={"center"}>
                                                <WechatOutlined style={{fontSize: 30}}/>
                                                <h4>{chat.name}</h4>
                                                <h4>{chat.description}</h4>
                                            </Flex>

                                            <Flex gap={5}>
                                                <Image style={{borderRadius: 20}} preview={false} width={30} height={30}
                                                       src={chat.owner.avatar}></Image>
                                                <span>{chat.owner.name}</span>
                                            </Flex>
                                        </Flex>
                                    )
                                    :
                                    <></>
                                }
                            </Flex>
                        )
                        :
                        <Empty/>
                    }
                </Flex>

                <Flex vertical>
                    <h3 style={{color: "#E6E7EF"}}>Нові повідомлення</h3>
                    <Flex className={"messagesWrapper"} style={{maxWidth: 270, overflowY: "hidden", maxHeight: "70vh"}} vertical={true}>
                        {latestMessages
                            ?
                            latestMessages.map((msg) =>
                                <Flex className={"message"} style={{backgroundColor: "#383857"}} key={"msg-"+msg.id} gap={8} >
                                    <div style={{marginTop: 4}}>
                                        <Image className={"messageImg nonSelect"} width={35} height={35} src={msg.sender.avatar}/>
                                    </div>
                                    <Flex vertical={true}>
                                        <Flex style={{position: "relative"}} className={"nonSelect"} gap={5} align={"center"} justify={"space-between"}>
                                            <span className={"senderName"}>{msg.sender.name}</span>
                                            <span className={"messageDate"} style={{margin: 0, alignSelf: "flex-end"}} >{toTime(msg.createdOn)}</span>
                                        </Flex>
                                        <div style={{marginTop: 3}}>
                                            <span className={"messageText"} style={{margin: 0, alignSelf: "flex-end"}} >{msg.text.substring(0, 50)}...</span>
                                        </div>
                                    </Flex>
                                </Flex>
                            )
                            :
                            <Empty/>
                        }
                    </Flex>
                    <Button ghost style={{margin: "0 8px"}}>Більше</Button>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default AllForumTopicsPage;