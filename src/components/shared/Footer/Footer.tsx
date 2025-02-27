import React from 'react';
import './Footer.css'
import {Flex} from "antd";
import {useLocation, useNavigate} from "react-router-dom";

const Footer = () => {
    const nav = useNavigate()
    const { pathname } = useLocation();


    if (pathname.includes("chat") || pathname.includes("news/new") || pathname.includes("manage-panel")) {
        return (<></>)
    }

    return (
        <Flex className={"footerWrapper"}
              justify={"flex-start"}
              align={"center"}>
            <Flex wrap={"wrap"}  className={"footerBody"}>
                <h1 className={"footerTitle"} onClick={() => nav('/')}>Милівська сільська територіальна громада</h1>
                <Flex vertical={true} wrap={"wrap"} gap={20}>
                    <Flex wrap={"wrap"} gap={8}>
                        <span onClick={() => nav("/newsFeed/all")} className={"footerBtn"}>Новини</span>
                        <span onClick={() => nav("/documents/all")} className={"footerBtn"}>Документи</span>
                        <span className={"footerBtn"}>Пошук</span>
                    </Flex>

                    <Flex wrap={"wrap"} gap={8}>
                        <span className={"footerBtn"}>ЦНАП</span>
                        <span className={"footerBtn"}>Військова адміністрація</span>
                        <span className={"footerBtn"}>Aдміністрація</span>
                    </Flex>
                    <span className={"copyright"}>© Милівська сільська територіальна громада, Бериславський р-н. Херсонська обл.</span>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Footer;