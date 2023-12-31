import React, {useCallback, useContext, useEffect} from 'react';
import ForumWrapper from "../components/ForumWrapper/ForumWrapper";
import {LoadingOutlined} from "@ant-design/icons";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import {Button, Flex} from "antd";
import {AuthContext} from "../context/AuthContext";
import {newUser, userIsRegistered} from "../API/services/forum/UserService";
import {NewUserDto} from "../API/services/forum/ForumInterfaces";

const IsRegisteredCheckPage = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const {user, isAuthenticated} = useAuth0()
    const {jwt, setJwt} = useContext(AuthContext)
    const nav = useNavigate()


    useEffect(() => {
        if (jwt && user) {
            const save = async () => {
                console.log(jwt)
                console.log(user)
                const newUserObj : NewUserDto = {
                    firstName : user.given_name,
                    lastName : user.family_name || user.nickname,
                    id : user.sub,
                    email : user.email,
                    avatar : user.picture
                }
                console.log(newUserObj  )
                console.log(searchParams.get("redirectTo"))
                const {data, error} = await newUser(newUserObj, jwt);

                if (data) {
                    console.log(data)
                    nav(String(searchParams.get("redirectTo")))
                }
                if (error) throw error
            }


            setTimeout(async () => {
                if (user.sub) {
                    const {data, error} = await userIsRegistered(user.sub, jwt);

                    if (data) {
                        nav(String(searchParams.get("redirectTo")))
                    } else {
                        save()
                    }

                    if (error) {
                        throw error
                    }
                } else throw new Error("can't call userIsRegistered")


            }, 800)
        }
    }, [jwt, user]);

    return (
        <Flex align={"center"} justify={"center"}
              style={{minHeight: "100vh", backgroundColor: "var(--forum-primary-bg-color)"}}>
            <Flex wrap={"wrap"}  gap={20} justify={"center"}>
                <Flex>

                    {isAuthenticated &&
                        <LoadingOutlined  style={{fontSize: 35, color: "#FFF", width: "fit-content", position: "relative", top: "-5vh"}} />
                    }


                    <Flex style={{color: "white"}}>
                        {!isAuthenticated &&
                            <Flex vertical justify={"center"}>
                                <h1>Not auth</h1>
                                <Button onClick={() => nav("/")} >Головна сторінка</Button>
                            </Flex>
                        }
                    </Flex>
                </Flex>
            </Flex>
        </Flex>


    );
};

export default IsRegisteredCheckPage;