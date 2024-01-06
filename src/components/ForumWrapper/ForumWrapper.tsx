import React, {FC, ReactNode} from 'react';
import {Flex} from "antd";

interface Wrapper {
    style? : React.CSSProperties,
    children : ReactNode
    gap? : number
}

const ForumWrapper : FC<Wrapper> = ({style, children, gap}) => {
    return (
        <Flex align={"flex-start"} justify={"center"}
              style={{paddingTop: "15vh", minHeight: "100vh", backgroundColor: "var(--forum-primary-bg-color)"}}>
            <Flex wrap={"wrap"} style={style} gap={gap || 20} justify={"center"}>
                {children}
            </Flex>
        </Flex>
    );
};

export default ForumWrapper;