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
              style={{paddingTop: "15vh", minHeight: "100vh", backgroundColor: "#1F2232"}}>
            <Flex style={style} gap={gap || 20} justify={"center"}>
                {children}
            </Flex>
        </Flex>
    );
};

export default ForumWrapper;