import React, {useEffect} from 'react';
import {getLatestPosts} from "../../../API/services/forum/PostService";
import {Flex} from "antd";
import Post from "../Post/Post";
import classes from './PostList.module.css'
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {useActions} from "../../../hooks/useActions";
import PostSkeleton from "../Post/PostSkeleton";
import {useLocation} from "react-router-dom";

const PostList = () => {
    const {posts} = useTypedSelector(state => state.forum)
    const {setPosts} = useActions()

    const getAll = async () => {
        const {data} = await getLatestPosts()
        if (data) setPosts(data)
    }

    useEffect(() => {
        if (posts.length === 0) {
            getAll()
        }
    }, []);
    const { pathname } = useLocation();
    return (
        <Flex vertical gap={10} className={classes.Wrapper} >
            {posts.length > 0
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