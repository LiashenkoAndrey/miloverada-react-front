import React from 'react';
import './Footer.css'
import {Button, Flex} from "antd";
import './Footer.css'
const Footer = () => {
    return (
        <Flex justify={"flex-start"} align={"center"} style={{backgroundColor: "#232235FF", padding: "30px 0"}}>
            <Flex  className={"footerBody"}>
                <h1 className={"footerTitle"}>Милівська сільська територіальна громада</h1>

                <Flex vertical={true} gap={20}>
                    <Flex gap={5}>
                        <Button>Новини</Button>
                        <Button>Документи</Button>
                        <Button>Пошук</Button>
                    </Flex>

                    <Flex gap={5}>
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