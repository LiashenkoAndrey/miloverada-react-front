import React, {FC} from 'react';
import {IPost} from "../../../API/services/forum/PostService";
import {Flex, Image} from "antd";
import {getImageV2Url} from "../../../API/services/ImageService";
import classes from './Post.module.css'
// @ts-ignore
import heartImg from '../../../assets/heart-svgrepo-com.svg'
// @ts-ignore
import chatImg from '../../../assets/chat-round-line-svgrepo-com.svg'
import {toDateV2} from "../../../API/Util";
import '../../../App.css'
// @ts-ignore
import placeholder from '../../../assets/image-placeholder-forum.svg'
import PostLike from "../PostLike/PostLike";
import PostComments from "../PostComments/PostComments";

interface PostProps {
    post: IPost
}


const Post: FC<PostProps> = ({post}) => {

    return (
        <Flex vertical gap={10} style={{maxWidth: 600, maxHeight: 700}}>
            <Flex style={{userSelect: "none"}}
                  align={"center"}
                  gap={5}
            >
                <Image height={40}
                       width={40}
                       className={"imageWithPlaceholder"}
                       style={{borderRadius: 20}}
                       src={post.author.avatar.includes("http") ? post.author.avatar : getImageV2Url(post.author.avatar)}
                />
                <span style={{color: "white"}}>{post.author.nickname}</span>
            </Flex>
            <Flex vertical>
                <Image style={{userSelect: "none"}} placeholder={
                    <img className={classes.image2}
                         src={placeholder}
                         alt="placeholder"
                    />
                }
                       className={classes.image}
                       src={getImageV2Url(post.imageId)}
                />
                <Flex vertical style={{color: "white"}}>
                    <span>{post.text}</span>
                    <span style={{userSelect: "none"}}>{toDateV2(post.createdOn)}</span>
                </Flex>
                <Flex className={classes.buttons} align={"center"} gap={10}>
                    <PostLike post={post}/>

                    {/*<PostComments post={post}/>*/}
                </Flex>
            </Flex>

        </Flex>
    );
};

export default Post;
