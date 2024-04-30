import React from 'react';
import {Breadcrumb, Button, Flex} from "antd";
import {LeftOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

const ChatNav = () => {
    const nav = useNavigate()

    return (
        <Flex justify={"flex-start"} className={"chatsWrapper"} vertical>
            <Flex justify={"center"} vertical={true} align={"center"} gap={30}>

                <Button onClick={() => nav(-1)}
                        style={{maxWidth: 150, color: "black"}}
                        icon={<LeftOutlined/>}
                >
                    Назад
                </Button>

                <Breadcrumb style={{color: "black"}}>
                    <Breadcrumb.Item>
                        <Button ghost onClick={() => nav("/")}
                        >
                            Головна
                        </Button>
                    </Breadcrumb.Item>
                </Breadcrumb>
            </Flex>
        </Flex>
    );
};

export default ChatNav;