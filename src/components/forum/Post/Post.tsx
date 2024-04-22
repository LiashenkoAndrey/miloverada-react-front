import React, {FC, useContext} from 'react';
import {IPost, likeOrDislikePost} from "../../../API/services/forum/PostService";
import {Flex, Image, message} from "antd";
import {getImageV2Url} from "../../../API/services/ImageService";
import classes from './Post.module.css'
// @ts-ignore
import heartImg from '../../../assets/heart-svgrepo-com.svg'
// @ts-ignore
import chatImg from '../../../assets/chat-round-line-svgrepo-com.svg'
import {toDateV2} from "../../../API/Util";
import {HeartFilled, HeartOutlined} from "@ant-design/icons";
import '../../../App.css'
// @ts-ignore
import placeholder from '../../../assets/image-placeholder-forum.svg'
import {AuthContext} from "../../../context/AuthContext";
import PostLike from "../PostLike/PostLike";

interface PostProps {
    post : IPost
}



const Post:FC<PostProps> = ({post}) => {

    return (
        <Flex vertical gap={10} style={{maxWidth: 600, maxHeight: 700}}>

            <Flex align={"center"} gap={5}>
                <Image height={40} style={{borderRadius: 20}} src={post.author.avatar.includes("http") ? post.author.avatar : getImageV2Url(post.author.avatar)}/>
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
                    <span>{toDateV2(post.createdOn)}</span>
                </Flex>
                <Flex className={classes.buttons} align={"center"} gap={10}>
                    <Flex gap={5}>
                        <PostLike post={post} />
                    </Flex>
                    <img height={23} src={chatImg} className={[classes.likeBtn, classes.btn].join(' ')}/>
                    <span className={classes.commentsAmount}> 6 коментарів...</span>
                </Flex>
            </Flex>

        </Flex>
    );
};

export default Post;