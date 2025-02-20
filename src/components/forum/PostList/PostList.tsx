import React, {useContext, useEffect, useState} from 'react';
import {getLatestPosts} from "../../../API/services/forum/PostService";
import {Button, Flex, notification, RadioChangeEvent} from "antd";
import Post from "../Post/Post";
import classes from './PostList.module.css'
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {useActions} from "../../../hooks/useActions";
import PostSkeleton from "../Post/PostSkeleton";
import {useAuth0} from "@auth0/auth0-react";
import {getPageVotes, newPageVote, NewVoteDto, IVote} from "../../../API/services/forum/VoteService";
import {PlusOutlined} from "@ant-design/icons";
import NewVoteModal from "../NewVoteModal/NewVoteModal";
import {AuthContext} from "../../../context/AuthContext";
import Vote from "../Vote/Vote";
import vote from "../Vote/Vote";

const PostList = () => {
    const {posts} = useTypedSelector(state => state.forum)
    const {setPosts} = useActions()
    const [isNoPosts, setIsNoPosts] = useState<boolean>(false);
    // const {forumUser} = useTypedSelector(state =>  state.user)
    const {user, isLoading} = useAuth0()
    const {jwt} = useContext(AuthContext)
    const getAll = async () => {
        let res;
        if (user?.sub) {
            // console.log("GET POSTS WITH USER ID")
            const {data} = await getLatestPosts(encodeURIComponent(user?.sub))
            res = data;

        } else {
            // console.log("GET POSTS not auth")

            const {data} = await getLatestPosts()
            res = data;
        }
        console.log(res)
        if (res) {
            if (res.length > 0) {
                setPosts(res)
            } else {
                setIsNoPosts(true)
            }
        }
    }

    useEffect(() => {
        setIsNoPosts(posts.length === 0)
    }, [posts]);

    useEffect(() => {
        console.log("GET POSTS")
        if (posts.length === 0) {
            getAll()
        }
    }, [user, isLoading]);

    const [isNewVoteModalOpen, setIsNewVoteModalOpen] = useState<boolean>(false)
    const [isNewVoteCreationLoading, setIsNewVoteCreationLoading] = useState<boolean>(false  )
    const onNewVote = async (vote : NewVoteDto) => {
        if (!jwt) {
            notification.warning({message : "Не авторизовано"})
            return;
        }
        setIsNewVoteCreationLoading(true)
        const {error, data} = await newPageVote(vote, jwt)
        setIsNewVoteCreationLoading(false)
        if (error) {
            notification.warning({message : "Помилка при створенні :( який жах..."})
        }
        if (data) {
            console.log(data)
        }
    }
    const [pageVote, setPageVote] = useState()
    const [voteValue, setVoteValue] = useState('')

    const getPageVote = async () => {
        const {data, error} = await getPageVotes();
        if (data) {
            console.log("vote ", data)
            setPageVote(data)
        }
        if (error) {
            console.error("Error when fetch votes")
        }
    }

    useEffect(() => {
        getPageVote()
    }, []);

    const onVoteOptionChange = (e: RadioChangeEvent) => {
        setVoteValue(e.target.value);
    };
    return (
        <Flex vertical gap={10} className={classes.Wrapper} >
            {/*<Button type={"primary"}*/}
            {/*        icon={<PlusOutlined/>}*/}
            {/*        onClick={() => setIsNewVoteModalOpen(true)}*/}
            {/*>*/}
            {/*    Нове опитування*/}
            {/*</Button>*/}
            {isNewVoteModalOpen &&
                <NewVoteModal isOpen={isNewVoteModalOpen}
                              isLoading={isNewVoteCreationLoading}
                              setIsOpen={setIsNewVoteModalOpen}
                              onConfirm={onNewVote}
                />
            }

            {isNoPosts
                ?
                <Flex gap={5} vertical align={'center'} className={classes.postListPlaceholder}>
                    <p>Жодний з користувачів не додав пост</p>
                    <p>Станьте першим!</p>
                </Flex>
                :
                posts.length > 0
                        ?
                        <Flex gap={10} style={{padding: 10}}>
                            <Flex vertical gap={30} style={{width: "100%"}}>

                                {pageVote &&
                                    <Vote value={voteValue} onChange={onVoteOptionChange}
                                          vote={pageVote}
                                    />
                                }

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
