import React, {useState} from 'react';
import {ConfigProvider, Flex, FloatButton} from "antd";
import {useAuth0} from "@auth0/auth0-react";
import ForumNavbar from "../../../components/ForumNavbar/ForumNavbar";
import classes from './ForumPage.module.css'
import {getActiveUsersAmount} from "../../../API/services/forum/UserService";
import ContentList from "./ContentList/ContentList";
import {CommentOutlined, CustomerServiceOutlined} from "@ant-design/icons";

const ForumPage = () => {

    const [activeUsersAmount, setActiveUsersAmount] = useState<number>()
    const {isAuthenticated} = useAuth0()

    const getUsersAmount = async () => {
        const {data, error} = await getActiveUsersAmount();
        if (data) {
            setActiveUsersAmount(data)
        }
        if (error) throw error;
    }

    // useEffect(() => {
    // getUsersAmount()
    // }, []);


    return (
        <ConfigProvider theme={{
            token: {
                colorPrimary: '#191a24',
            },
            components: {
                Segmented: {
                    itemSelectedBg: "rgba(94,94,107,0.46)",
                }
            }
        }}>
            <Flex wrap={"wrap"}
                  align={"flex-start"}
                  justify={"center"}
                  className={[classes.wrapper, classes.forumBg].join(' ')}
            >
                <Flex
                    className={classes.pageWrapper}
                    gap={10}
                >
                    <ForumNavbar/>
                    <ContentList/>

                </Flex>
            </Flex>

            <FloatButton.Group
                trigger="click"
                style={{ right: 24 }}
                icon={<CustomerServiceOutlined />}
            >
                <FloatButton />
                <FloatButton icon={<CommentOutlined />} />
            </FloatButton.Group>
        </ConfigProvider>

    );
};

export default ForumPage;
