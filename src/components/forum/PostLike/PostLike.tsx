import React, {FC, useContext, useEffect, useState} from 'react';
import {HeartFilled, HeartOutlined} from "@ant-design/icons";
import {IPost, likeOrDislikePost} from "../../../API/services/forum/PostService";
import {AuthContext} from "../../../context/AuthContext";
import classes from './PostLike.module.css'
import { Tooltip } from 'antd';
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {useActions} from "../../../hooks/useActions";


interface PostLikeProps {
    post : IPost
}

const PostLike:FC<PostLikeProps> = ({post}) => {
    const {jwt} = useContext(AuthContext)
    const {forumUser} = useTypedSelector(state => state.user)
    const {posts} = useTypedSelector(state => state.forum)
    const {setPosts} =  useActions()
    const onLike = async () => {
        console.log(forumUser)
        if (jwt && forumUser?.id) {
            console.log(forumUser.id)
            const {data} = await likeOrDislikePost(post.id, encodeURIComponent(forumUser.id), jwt)
            if (data) {
                console.log(data);
                const index = posts.indexOf(post);
                if (posts[index].isUserLikedPost !== null) {
                    console.log(posts[index].isUserLikedPost)
                    if (posts[index].isUserLikedPost) {
                        console.log("DECREMENT")
                        posts[index].likesAmount = posts[index].likesAmount - 1
                    }  else {
                        console.log("INCREMENT 1")

                        posts[index].likesAmount = posts[index].likesAmount + 1

                    }
                    posts[index].isUserLikedPost = !posts[index].isUserLikedPost


                } else {
                    posts[index].isUserLikedPost = true
                    console.log("INCREMENT 2")

                    posts[index].likesAmount = posts[index].likesAmount + 1
                }
                console.log(posts)
                setPosts([...posts])
            }
        } else console.log("jwt or forum user is null", forumUser)
    }

    return (
        <>

            {jwt ?
                    <HeartFilled className={[classes.heart, post.isUserLikedPost ? classes.liked : classes.filledLikeBtn].join(" ")}
                                 onClick={onLike}
                    />
                    :

                    <Tooltip title={"Ввійдіть щоб оцінити пост!"}>
                        <HeartFilled className={classes.filledLikeBtn}
                        />
                    </Tooltip>

            }
            <span style={{color: "white", fontSize: 16, userSelect: "none"}}>{post.likesAmount}</span>
        </>
    );
};

export default PostLike;
