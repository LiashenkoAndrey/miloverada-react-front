import React, {useEffect, useState} from 'react';
import {getLatestPosts} from "../../../API/services/forum/PostService";
import {Flex, Button} from "antd";
import Post from "../Post/Post";
import classes from './PostList.module.css'
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {useActions} from "../../../hooks/useActions";
import PostSkeleton from "../Post/PostSkeleton";
import {useLocation} from "react-router-dom";

const PostList = () => {
    const {posts} = useTypedSelector(state => state.forum)
    const {setPosts} = useActions()
    const [isNoPosts, setIsNoPosts] = useState<boolean>(false);


    const getAll = async () => {
        const {data} = await getLatestPosts()
        if (data) {
            if (data.length > 0) {
                setPosts(data)
            } else {
                setIsNoPosts(true)
            }
        }
    }

    useEffect(() => {
        if (posts.length === 0) {
            getAll()
        }
    }, []);


    return (
        <Flex vertical gap={10} className={classes.Wrapper} >
            {isNoPosts
                ?
                <Flex gap={5} vertical align={'center'} className={classes.postListPlaceholder}>
                    <p>Жодний з користувачів не додав пост</p>
                    <p>Станьте першим!</p>
                    <Button style={{width : "fit-content"}}>Новий пост</Button>
                </Flex>
                :
                posts.length > 0
                        ?
                        <Flex gap={10} style={{padding: 10}}>
                            <Flex vertical gap={30} style={{width: "100%"}}>
                                {posts.slice(0, posts.length/2).map((post) =>
                                    <Post post={post} key={"post-" + post.id}/>
                                )}
                            </Flex>
                            <Flex gap={30} vertical style={{width: "100%"}}>
                                {posts.slice(posts.length/2, posts.length).map((post) =>
                                    <Post post={post} key={"post-" + post.id}/>
                                )}
                            </Flex>
                        </Flex>
                        :
                        <Flex gap={15} style={{padding: 10, width : "100%"}}>
                            <Flex vertical gap={30} style={{width: "100%"}}>
                                {[1,2,3].map((post, index) =>
                                    <PostSkeleton  key={"post-" + index}/>
                                )}
                            </Flex>
                            <Flex gap={30} vertical style={{width: "100%"}}>
                                {[6,7,8].map((post, index) =>
                                    <PostSkeleton key={"post-" + index}/>
                                )}
                            </Flex>
                        </Flex>

            }

        </Flex>
    );
};

export default PostList;