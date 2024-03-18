import React, {FC, useEffect, useState} from 'react';
import {getLatestStories, Story} from "../../../API/services/forum/StoryService";
import {Flex, Image} from "antd";
import {
    DownloadOutlined,
    PlusCircleTwoTone,
    RotateLeftOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
} from "@ant-design/icons";
import classes from './StoriesList.module.css'
import NewStoryModal from "../NewStoryModal";
import {getImageV2Url} from "../../../API/services/ImageService";
import NewPostModal from "../NewPostModal";
import {IPost} from "../../../API/services/forum/PostService";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {useActions} from "../../../hooks/useActions";
import {useAuth0} from "@auth0/auth0-react";
import {useLocation} from "react-router-dom";

interface StoriesListProps {
    isPost : boolean
}
const StoriesList:FC<StoriesListProps> = ({isPost}) => {
    const  location = useLocation()
    const [stories, setStories] = useState<Story[]>([])
    const [isNewStoryModalOpen, setIsNewStoryModalOpen] = useState<boolean>(false)
    const [isNewPostModalOpen, setIsNewPostModalOpen] = useState<boolean>(false)
    const {posts} = useTypedSelector(state => state.forum)
    const {setPosts} = useActions()
    const {isAuthenticated} = useAuth0()

    const addNewPost = (post : IPost) => {
        setPosts([post, ...posts])
    }
    const getAll = async () => {
        const {data} = await getLatestStories();
        if (data) setStories(data)
    }

    useEffect(() => {
        getAll()
    }, []);

    const onNewStory = () => {
        setIsNewStoryModalOpen(true)
    }

    const onNewPost = () => {
        setIsNewPostModalOpen(true)
    }

    return (
        <Flex className={classes.wrapper} align={"center"} gap={10} style={{marginLeft: 10, marginBottom: 3}}>
            {(isPost && isAuthenticated && !location.pathname.includes("/chat/")) &&
                <Flex className={classes.btn} vertical gap={2} align={"center"} style={{cursor: "pointer"}}
                      onClick={onNewStory}>
                    <PlusCircleTwoTone twoToneColor={"#191a24"} style={{fontSize: 30}}/>
                    <span style={{color: "#B1B8BEFF"}}>Ваша історія </span>
                </Flex>
            }
           
            {(isAuthenticated && !location.pathname.includes("/chat/")) &&
                <Flex className={classes.btn} vertical gap={2} align={"center"} style={{cursor: "pointer"}}
                      onClick={onNewPost}>
                    <PlusCircleTwoTone twoToneColor={"#191a24"} style={{fontSize: 30}}/>
                    <span style={{color: "#B1B8BEFF"}}>Новий пост </span>
                </Flex>
            }

            <Image.PreviewGroup key={333} preview={{
                toolbarRender: (
                    _,
                    {
                        transform: {scale},
                        actions: {onRotateLeft, onZoomOut, onZoomIn},
                        current
                    },
                ) => (
                    <Flex gap={25} className={classes.toolbarWrapper}>
                        <a href={getImageV2Url(stories[current].imageId)}
                           style={{color: "white", textDecoration: "none"}}>
                            <DownloadOutlined style={{color: "white"}}/>

                        </a>
                        <RotateLeftOutlined onClick={onRotateLeft}/>
                        <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut}/>
                        <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn}/>
                    </Flex>
                ),
            }}>
                {stories.map((e) =>
                    <Flex key={"story-" + e.id} vertical>
                        <Image
                            style={{border: "solid 2px", borderColor: "#389a3b", borderRadius: 10, position: "relative"}}
                            height={50}
                            src={getImageV2Url(e.imageId)}
                        />
                        <span style={{color: "#B1B8BEFF", whiteSpace: "nowrap"}}>
                            {e.author.firstName}
                        </span>
                    </Flex>
                )}
            </Image.PreviewGroup>


            <NewPostModal addNewPost={addNewPost}
                          isOpen={isNewPostModalOpen}
                          setIsOpen={setIsNewPostModalOpen}
            />
            <NewStoryModal isOpen={isNewStoryModalOpen} setIsOpen={setIsNewStoryModalOpen}/>
        </Flex>
    );
};

export default StoriesList;