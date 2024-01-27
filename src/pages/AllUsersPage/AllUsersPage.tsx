import React, {useEffect, useState} from 'react';
import {Flex} from "antd";
import {User} from "../../API/services/forum/ForumInterfaces";
import classes from './AllUsersPage.module.css'
import {getAllUsers} from "../../API/services/forum/UserService";
import UserElem from "../../components/User/UserElem";
import ForumNavbar from "../../components/ForumNavbar/ForumNavbar";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
const AllUsersPage = () => {

    const [users, setUsers] = useState<User[]>([])
    const nav = useNavigate()
    const getUsers = async () => {
        const {data} = await getAllUsers()
        if (data) {
            setUsers(data)
        }
    }

    useEffect(() => {
        getUsers()
    }, []);

    return (
        <Flex wrap={"wrap"} align={"flex-start"} justify={"center"}
              style={{paddingTop: "5vh", minHeight: "100vh", backgroundColor: "var(--forum-primary-bg-color)", paddingBottom: "15vh"}}>
            <Flex align={"center"}  wrap={"wrap"} className={classes.pageWrapper} gap={10} justify={"center"}>

                <ForumNavbar>
                </ForumNavbar>
                <Flex vertical style={{order: 1}} className={classes.usersWrapper}>
                    <Flex align={"center"} gap={10}>
                        <ArrowLeftOutlined onClick={() => nav(-1)}  className={classes.back} style={{fontSize: 27, cursor: "pointer"}} />
                        <h1>Користувачі</h1>
                    </Flex>
                    <Flex vertical gap={5}>
                        {users.map((user) =>
                            <UserElem key={"user-" + user.id} user={user}/>
                        )}
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default AllUsersPage;