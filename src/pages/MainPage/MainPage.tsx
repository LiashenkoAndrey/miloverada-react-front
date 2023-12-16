import React from 'react';
import './MainPage.css'
import {Button, Flex} from "antd";
const MainPage = () => {
    return (
        <div style={{position:"relative", height:" 100%"}}>
            <div className={"mainImg"}></div>
            <Flex vertical={true} className={"content"}>
                <Flex vertical={true} align={"center"} style={{backgroundColor: "#fff", paddingBottom: 70}}>
                    <h1 style={{fontSize: "3.0517578125em"}}>A Societal Mission</h1>

                    <p style={{maxWidth: "70vw", fontSize: "1.953125em", fontWeight: 300, textAlign: "center"}}>
                        Stanford was founded almost 150 years ago on a bedrock of societal purpose. Our mission is to contribute to the world by educating students for lives of leadership and contribution with integrity; advancing fundamental knowledge and cultivating creativity; leading in pioneering research for effective clinical therapies; and accelerating solutions and amplifying their impact.
                    </p>

                    <Button type={"primary"} style={{borderRadius: 0, color: "white", fontSize: 30, height: "fit-content", padding: "3px 4em"}}>Читати далі</Button>
                </Flex>

                <Flex vertical={true} align={"center"} style={{backgroundColor: "#f4f4f4", paddingTop: 30}}>
                    <h1 style={{fontSize: "3.0517578125em", marginBottom: 0}}>Новини громади</h1>
                    <p style={{fontSize: 28, fontWeight: 400}}>
                        Stories about people, research, and innovation across the Farm
                    </p>
                </Flex>
            </Flex>
        </div>
    );
};

export default MainPage;