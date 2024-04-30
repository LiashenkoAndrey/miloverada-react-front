import React, {useContext, useEffect, useState} from 'react';
import {LoadingOutlined} from "@ant-design/icons";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import {Button, Flex} from "antd";
import {AuthContext} from "../context/AuthContext";
import {userIsRegistered} from "../API/services/forum/UserService";
import {AppUser, NewUserDto} from "../API/services/forum/ForumInterfaces";
import {checkPermission, getBase642} from "../API/Util";
import {getUserAvatar, newUser, UserDto} from "../API/services/UserService";
import {useActions} from "../hooks/useActions";
import {setAdminMetadata, setUser} from "../store/actionCreators/user";

const IsRegisteredCheckPage = () => {

    const [searchParams, ] = useSearchParams();
    const {user, isAuthenticated} = useAuth0()
    const {jwt,} = useContext(AuthContext)
    const nav = useNavigate()
    const {setUser} = useActions()

    useEffect(() => {
        if (jwt && user) {
            const saveUser = async (base64Avatar : string, avatarContentType : string) => {
                if (user.sub && user.picture) {
                    const newUserObj : NewUserDto = {
                        firstName : user.given_name,
                        lastName : user.family_name || user.nickname,
                        id : user.sub,
                        email : user.email,
                        avatarContentType : avatarContentType,
                        avatarBase64Image :  base64Avatar,
                        avatarUrl : user.picture
                    }
                    const {data, error} = await newUser(newUserObj, jwt);
                    if (data) {
                        console.log(data)
                        nav(String(searchParams.get("redirectTo")))
                    }
                    if (error) throw error
                } else console.error("user data null")
            }

            const getAvatarAndThenSaveUser = async () => {
                console.log("getAvatarAndThenSaveUser ", user)
                if (user.picture) {
                    const {data, error} = await getUserAvatar(user.picture)
                    if (data) {
                        let blobAvatar = new Blob([data], {type: "image/jpeg"})
                        getBase642(blobAvatar, (res :string) => {
                            saveUser(res, 'image/jpeg')
                        })
                    }
                    if (error) {
                        console.log("can't load user avatar")
                    }
                }
            }

            setTimeout(async () => {
                if (user.sub) {

                    let isAdmin = false;
                    if (checkPermission(jwt, "admin")) {
                        console.log("IS ADMIN!!!")
                        isAdmin = true
                    } else {
                        console.log("JUST USER")
                    }


                    const {data, error} = await userIsRegistered(user.sub, isAdmin, jwt);

                    if (data) {
                        const userDto : UserDto = data
                        console.log(userDto)
                        if (userDto.isRegistered) {

                            if (userDto.adminMetadata) {
                                setAdminMetadata(userDto.adminMetadata)
                            }
                            setUser(userDto.appUser)
                            console.log("userIsRegistered")
                            nav(String(searchParams.get("redirectTo")))
                        } else {
                            getAvatarAndThenSaveUser()
                        }
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