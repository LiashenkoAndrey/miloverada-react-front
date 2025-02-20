import React from 'react';
import {Flex, Skeleton} from "antd";

const NewsListLoader = () => {
    return (
        <Flex gap={35} wrap={"wrap"} justify={"center"} className={"newsList"}>
            {[1,2,3,4,5,6].map((newsOne =>
                <div key={newsOne} className={"newsCard"}>
                    <Skeleton.Image active={true}/>
                    <div className={"newsCardContent"}>
                        <Skeleton active={true}/>
                    </div>
                </div>
            ))}
        </Flex>
    );
};

export default NewsListLoader;