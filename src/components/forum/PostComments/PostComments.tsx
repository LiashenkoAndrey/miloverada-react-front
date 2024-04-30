import React, {FC} from 'react';
import classes from './PostComments.module.css'
import {Flex} from "antd";
// @ts-ignore
import chatImg from "../../../assets/chat-round-line-svgrepo-com.svg";
import {IPost} from "../../../API/services/forum/PostService";

interface PostCommentsProps {
    post : IPost
}

const PostComments:FC<PostCommentsProps> = ({post}) => {
    return (
        <Flex>
            <img height={30}
                 src={chatImg}
                 className={[classes.likeBtn, classes.btn].join(' ')}
            />
            {post.commentsTotalAmount === 0 ?
                <span className={classes.commentBtn}>Коментувати</span>
                :
                <span className={classes.commentsAmount}> 6 коментарів...</span>

            }
        </Flex>
    );
};

export default PostComments;