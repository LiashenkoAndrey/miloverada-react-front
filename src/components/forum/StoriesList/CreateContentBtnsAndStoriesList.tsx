import React, {FC, useEffect, useState} from 'react';
import {getLatestStories, IStory} from "../../../API/services/forum/StoryService";
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
import NewTopic from "../../NewTopic";

interface StoriesListProps {
    isPost : boolean
    isTopic : boolean
}



const CreateContentBtnsAndStoriesList:FC<StoriesListProps> = ({isPost, isTopic}) => {
    const  location = useLocation()
    const {stories} = useTypedSelector(state => state.forum)
    const {setStories} = useActions()
    const [isNewStoryModalOpen, setIsNewStoryModalOpen] = useState<boolean>(false)
    const [isNewPostModalOpen, setIsNewPostModalOpen] = useState<boolean>(false)
    const [isNewTopicModalOpen, setIsNewTopicModalOpen] = useState<boolean>(false)
    const {isAuthenticated} = useAuth0()


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

    const onNewTopic = () => {
        setIsNewTopicModalOpen(true)
    }

    return (
        <Flex className={classes.wrapper} align={"center"} gap={10} style={{marginBottom: 3}}>

            <Flex gap={5}>
                {(isAuthenticated && !location.pathname.includes("chat")) &&
                    <Flex className={classes.btn}
                          onClick={onNewStory}>
                        <PlusCircleTwoTone twoToneColor={"#191a24"} style={{fontSize: 30}}/>
                        <span>Ваша історія </span>
                    </Flex>
                }


                {(isPost && isAuthenticated && !location.pathname.includes("chat")) &&
                    <Flex className={classes.btn}
                          onClick={onNewPost}>
                        <PlusCircleTwoTone twoToneColor={"#191a24"} style={{fontSize: 30}}/>
                        <span>Новий пост </span>
                    </Flex>
                }


                {(isTopic && isAuthenticated && !location.pathname.includes("chat")) &&
                    <Flex className={classes.btn}
                          onClick={onNewTopic}>
                        <PlusCircleTwoTone twoToneColor={"#191a24"} style={{fontSize: 30}}/>
                        <span>Нова тема </span>
                    </Flex>
                }
            </Flex>


            <Image.PreviewGroup key={333} preview={{
                toolbarRender: (

                    _,
                    {
                        transform: {scale},
                        actions: {onRotateLeft, onZoomOut, onZoomIn},
                        current
                    },
                ) => (
                    <Flex vertical gap={8} style={{width: "100vw"}} align={"center"}>
                            <span  style={{fontSize: 20, color: "white"}}>{stories[current].text}</span>
                        <Flex gap={25} className={classes.toolbarWrapper}>
                            <a href={getImageV2Url(stories[current].imageId)}
                               style={{color: "white", textDecoration: "none"}}>
                                <DownloadOutlined style={{color: "white"}}/>

                            </a>
                            <RotateLeftOutlined onClick={onRotateLeft}/>
                            <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut}/>
                            <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn}/>
                        </Flex>

                    </Flex>
                ),
            }}>

                <Flex gap={9}
                      style={{overflowX: "scroll", msOverflowStyle: "none", scrollbarWidth: "none", width: "100%"}}>
                    {stories.map((e) =>
                            <Flex style={{minWidth: 90}} key={"story-" + e.id} vertical>
                                <Image
                                    height={50}
                                    className={classes.storyImg}
                                        src={getImageV2Url(e.imageId)}
                                    />
                                    <span style={{color: "#B1B8BEFF", whiteSpace: "nowrap"}}>
                            {e.author.firstName}
                        </span>
                                </Flex>
                        )}
                    </Flex>

            </Image.PreviewGroup>


            <NewPostModal isOpen={isNewPostModalOpen}
                          setIsOpen={setIsNewPostModalOpen}
            />
            <NewTopic isOpen={isNewTopicModalOpen} setIsOpen={setIsNewTopicModalOpen}/>
            <NewStoryModal isOpen={isNewStoryModalOpen} setIsOpen={setIsNewStoryModalOpen}/>
        </Flex>
    );
};


export default CreateContentBtnsAndStoriesList;