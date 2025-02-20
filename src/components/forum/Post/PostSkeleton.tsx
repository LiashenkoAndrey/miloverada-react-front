import React from 'react';
import classes from './Post.module.css'
import {Flex, Image, Skeleton} from "antd";
import {getImageV2Url} from "../../../API/services/shared/ImageService";
import {toDateV2} from "../../../API/Util";
import {HeartFilled} from "@ant-design/icons";
// @ts-ignore
import chatImg from "../../../assets/chat-round-line-svgrepo-com.svg";
// @ts-ignore
import placeholder from '../../../assets/image-placeholder.svg'

const PostSkeleton = () => {
    return (
        <Flex vertical gap={10} style={{maxWidth: 600, maxHeight: 700}}>
            <Flex align={"center"} gap={5}>
                <Skeleton.Avatar/>
                <Skeleton.Input style={{borderRadius: 40}} size={"small"}/>
            </Flex>
            <Flex vertical gap={10}>
                <Flex style={{maxWidth: 500, width: "100%"}} justify={"center"}>
                    <Skeleton.Image active style={{maxWidth: 500, width: 200, height: 200}}/>

                </Flex>
                <Flex vertical style={{color: "white"}}>
                    <Skeleton active/>
                </Flex>
                {/*<Flex className={classes.buttons} align={"center"} gap={10}>*/}
                {/*    <Flex>*/}
                {/*        <HeartFilled onClick={onLike} className={classes.likeBtn} />*/}
                {/*        /!*<img src={heartImg} className={[classes.likeBtn, classes.btn].join(' ')} />*!/*/}
                {/*        <img src={chatImg} className={[classes.likeBtn, classes.btn].join(' ')} />*/}
                {/*    </Flex>*/}
                {/*    <span className={classes.commentsAmount} > 6 коментарів...</span>*/}
                {/*</Flex>*/}
            </Flex>

        </Flex>
    );
};

export default PostSkeleton;