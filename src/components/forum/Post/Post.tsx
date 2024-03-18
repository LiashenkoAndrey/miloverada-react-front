import React, {FC, useRef, useState} from 'react';
import {IPost} from "../../../API/services/forum/PostService";
import {Flex, Image, message} from "antd";
import {getImageV2Url} from "../../../API/services/ImageService";
import classes from './Post.module.css'
// @ts-ignore
import heartImg from '../../../assets/heart-svgrepo-com.svg'
// @ts-ignore
import chatImg from '../../../assets/chat-round-line-svgrepo-com.svg'
import {toDateV2} from "../../../API/Util";
import {HeartFilled} from "@ant-design/icons";
import { CSSTransition } from 'react-transition-group';
import '../../../App.css'
// @ts-ignore
import placeholder from '../../../assets/image-placeholder-forum.svg'
interface PostProps {
    post : IPost
}



const Post:FC<PostProps> = ({post}) => {
    const onLike = () => {
        message.success({content: "Пост оцінено"})
    }
    return (
        <Flex vertical gap={10} style={{maxWidth: 600, maxHeight: 700}}>

            <Flex align={"center"} gap={5}>
                <Image height={40} style={{borderRadius: 20}} src={post.author.avatar}/>
                <span style={{color: "white"}}>{post.author.firstName}</span>
            </Flex>
            <Flex vertical>
                <Image placeholder={
                    <img className={classes.image2} src={placeholder} alt="placeholder"/>
                    }
                       className={classes.image}
                       src={getImageV2Url(post.imageId)}
                />
                <Flex vertical style={{color: "white"}}>
                    <span>{post.text}</span>
                    <span>{toDateV2(post.createdOn) }</span>
                </Flex>
                <Flex className={classes.buttons} align={"center"} gap={10}>
                    <Flex gap={5}>
                        <HeartFilled onClick={onLike} className={classes.likeBtn} />
                        {/*<img src={heartImg} className={[classes.likeBtn, classes.btn].join(' ')} />*/}
                        <img src={chatImg} className={[classes.likeBtn, classes.btn].join(' ')} />
                    </Flex>
                    <span className={classes.commentsAmount} > 6 коментарів...</span>
                </Flex>
            </Flex>

        </Flex>
    );
};

export default Post;