import React, {useContext, useEffect, useRef, useState} from 'react';
import classes from './AboutPage.module.css'
import {Flex, notification, Skeleton} from "antd";
import {AuthContext} from "../../context/AuthContext";
import {useAuth0} from "@auth0/auth0-react";
import {getAboutCommunity, IAboutCommunity, updateAboutCommunity} from "../../API/services/AboutCommunityService";
import EditMainTextModal from "../NewsPage/EditMainTextModal";
import BackBtn from "../../components/BackBtn/BackBtn";

const AboutPage = () => {
    const {jwt} = useContext(AuthContext)
    const {isAuthenticated} = useAuth0()
    const [about, setAbout] = useState<IAboutCommunity>()
    const [text, setText] = useState<string>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const getAbout = async () => {
        const {data, error} = await getAboutCommunity()
        if (data) {
            setAbout(data)
            setText(data.mainText)
        }
        if (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getAbout()
    }, []);

    const topArch = useRef<HTMLHeadingElement>(null);
    const onUpdateText = async () => {
        if (jwt && text) {
            setIsLoading(true)
            const formData = new FormData();
            formData.append("mainText", text)
            const {data, error} = await updateAboutCommunity(formData, jwt)

            setIsLoading(false)
            if (data) {
                console.log(data)
                notification.success({message: "Оновлено успішно!"})
            }
            if (error) {
                notification.error({message: "Виникла помилка :( Спробуйте ще раз!"})
            }
        } else {
            notification.warning({message: "Не авторизована дія!"})
        }
    }
    useEffect(() => {
        if (topArch.current) {
            topArch.current.scrollIntoView({behavior: "smooth", block: "end"})
        }
    }, []);

    return (
        <Flex justify={"center"} className={classes.wrapper} >

            <Flex vertical className={classes.content}>
                <BackBtn style={{width: "60px"}} />

                <h1 ref={topArch}>Про нашу громаду</h1>
                {about
                    ?
                    <EditMainTextModal isLoading={isLoading}
                                       setText={setText}
                                       text={text}
                                       onOk={onUpdateText}
                    />
                    :
                    <>
                        <Skeleton/>
                        <Skeleton/>
                        <Skeleton/>
                        <Skeleton/>
                        <Skeleton/>
                    </>
                }
            </Flex>

        </Flex>
    );
};

export default AboutPage;