import React, {FC, useEffect, useState} from 'react';
import {Empty, Flex, Image} from "antd";
import {toTime} from "../../../../API/Util";
import {Message} from "../../../../API/services/forum/ForumInterfaces";
import {getLatestMessages} from "../../../../API/services/forum/MessageService";


const LatestMessagesList : FC = () => {

    const [latestMessages, setLatestMessages] = useState<Array<Message>>([]);

    useEffect(() => {
        const getMessages = async () => {
            const {data, error} = await getLatestMessages();
            if (data) {
                setLatestMessages(data)
            }
            if (error) throw error;
        }
        getMessages()
    }, []);


    return (
        <Flex vertical>
            <h3 style={{color: "var(--forum-primary-title-color)"}}>Нові повідомлення</h3>
            <Flex className={"messagesWrapper"} vertical={true}>
                {latestMessages.length > 0
                    ?
                    latestMessages.map((msg) =>
                        <Flex className={"message"}
                              key={"msg-"+msg.id}
                              gap={8}
                        >
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
                    <Empty description={<span style={{color : "white"}}>Поки немає обговорень</span>} />
                }
            </Flex>
        </Flex>
    );
};

export default LatestMessagesList;