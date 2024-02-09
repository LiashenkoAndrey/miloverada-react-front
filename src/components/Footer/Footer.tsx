import React from 'react';
import './Footer.css'
import {Button, Flex} from "antd";
import './Footer.css'
import {useLocation} from "react-router-dom";
const Footer = () => {

    const { pathname } = useLocation();

    return (
        <Flex className={"footerWrapper"} justify={"flex-start"} align={"center"} style={{display: pathname.includes("chat") || pathname.includes("news/new") ? "none" : "flex"}} >
            <Flex wrap={"wrap"}  className={"footerBody"}>
                <h1 className={"footerTitle"}>Милівська сільська територіальна громада</h1>
                <Flex vertical={true} wrap={"wrap"} gap={20}>
                    <Flex wrap={"wrap"} gap={5}>
                        <Button>Новини</Button>
                        <Button>Документи</Button>
                        <Button>Пошук</Button>
                    </Flex>

                    <Flex wrap={"wrap"} gap={5}>
                        <Button>ЦНАП</Button>
                        <Button>Військова адміністрація</Button>
                        <Button>Фдміністрація</Button>
                    </Flex>
                    <span className={"copyright"}>© Милівська сільська територіальна громада, с. Милове, Бериславський р-н. Херсонська обл.</span>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Footer;