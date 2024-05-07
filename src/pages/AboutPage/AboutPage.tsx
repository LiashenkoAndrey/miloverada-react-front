import React, {useEffect, useRef} from 'react';
import classes from './AboutPage.module.css'
import {Flex} from "antd";

const AboutPage = () => {


    const topArch = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (topArch.current) {
            topArch.current.scrollIntoView({behavior: "smooth", block: "end"})
        }
    }, []);

    return (
        <Flex justify={"center"} className={classes.wrapper}>
            <Flex vertical className={classes.content}>
                <h1 ref={topArch}>Про нашу громаду</h1>

                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid enim excepturi in mollitia natus. Architecto dicta dolor doloribus eos expedita laborum nihil obcaecati recusandae similique voluptate. Doloremque explicabo libero nostrum.</p>
            </Flex>
        </Flex>
    );
};

export default AboutPage;