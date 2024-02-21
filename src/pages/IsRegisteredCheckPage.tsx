import React, {useContext, useEffect, useState} from 'react';
import {LoadingOutlined} from "@ant-design/icons";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import {Button, Flex} from "antd";
import {AuthContext} from "../context/AuthContext";
import {newUser, userIsRegistered} from "../API/services/forum/UserService";
import {NewUserDto} from "../API/services/forum/ForumInterfaces";
import axios from "axios";
import {getBase642} from "../API/Util";

const IsRegisteredCheckPage = () => {

    const [searchParams, ] = useSearchParams();
    const {user, isAuthenticated} = useAuth0()
    const {jwt,} = useContext(AuthContext)
    const nav = useNavigate()

    useEffect(() => {
        if (jwt && user) {
            const saveUser = async (avatarContentType : string, base64Avatar : string) => {
                const newUserObj : NewUserDto = {
                    firstName : user.given_name,
                    lastName : user.family_name || user.nickname,
                    id : user.sub,
                    email : user.email,
                    avatarContentType : avatarContentType,
                    base64Avatar
                }
                console.log("save user", newUserObj)

                const {data, error} = await newUser(newUserObj, jwt);
                if (data) {
                    console.log(data)
                    // nav(String(searchParams.get("redirectTo")))
                }
                if (error) throw error
            }

            const getAvatarAndThenSaveUser = async () => {
                if (user.picture) {
                    console.log(user.picture)
                    const response = await axios.get(user.picture, {
                        responseType: "blob"
                    })
                    if (response.data) {
                        const blobAvatar: Blob = response.data
                        getBase642(blobAvatar, (base64Avatar: string) => {
                            saveUser(blobAvatar.type ,base64Avatar)
                        })
                    }
                }
            }

            setTimeout(async () => {
                if (user.sub) {
                    const {data, error} = await userIsRegistered(user.sub, jwt);
                    if (data) {
                        console.log(data)
                        console.log("userIsRegistered")
                        // nav(String(searchParams.get("redirectTo")))
                    } else {
                        getAvatarAndThenSaveUser()
                    }

                    if (error) {
                        throw error
                    }
                }
            }, 800)
        }
    }, [jwt, user]);

    return (
        <Flex align={"center"} justify={"center"}
              style={{minHeight: "100vh", backgroundColor: "#282A3E"}}>
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