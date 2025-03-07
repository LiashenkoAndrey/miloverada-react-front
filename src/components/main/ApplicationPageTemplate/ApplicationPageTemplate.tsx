import React, {CSSProperties, FC, ReactNode} from 'react';
// @ts-ignore
import applicationBg from "../../../assets/backgrounds/application.webp";
import {Flex} from "antd";
import classes from './ApplicationPageTemplate.module.css'

interface ApplicationPageTemplateProps {
  children : ReactNode
  style? : CSSProperties
}

const ApplicationPageTemplate: FC<ApplicationPageTemplateProps> = ({children, style}) => {
    return (
        <Flex className={classes.mainWrapper} style={{
          minHeight: "100vh",
          backgroundImage: `url(${applicationBg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover"
        }}
              align={"center"} justify={"center"}>
          <Flex  className={classes.wrapper} style={{
            backgroundColor: "#f8f9fa",
            padding: 50,
            borderRadius: 20,
            border: "black 2px solid",
            ...style
          }} vertical gap={10}>
            {children}
          </Flex>
        </Flex>
    );
};

export default ApplicationPageTemplate;