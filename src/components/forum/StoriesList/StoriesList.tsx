import React, {ReactNode, useEffect, useState} from 'react';
import {getLatestStories, Story} from "../../../API/services/forum/StoryService";
import {Avatar, Flex, Image, Space} from "antd";
import {PlusCircleTwoTone,
    DownloadOutlined,
    RotateLeftOutlined,
    RotateRightOutlined,
    SwapOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
} from "@ant-design/icons";
import classes from './StoriesList.module.css'
import NewStoryModal from "../NewStoryModal";
import {getImageV2Url} from "../../../API/services/ImageService";


const StoriesList = () => {
    const [stories, setStories] = useState<Story[]>([])
    const [isNewStoryModalOpen, setIsNewStoryModalOpen] = useState<boolean>(false)

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

    const onDownload = (imgIndex : number) => {
        fetch(getImageV2Url(stories[imgIndex].imageId))
            .then((response) => response.blob())
            .then((blob) => {
                const url = URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                document.body.appendChild(link);
                link.click();
                URL.revokeObjectURL(url);
                link.remove();
            });
    };

    return (
        <Flex align={"center"} gap={10} style={{marginLeft: 10, marginBottom: 3}}>
            <Flex vertical gap={2} align={"center"} style={{cursor: "pointer"}} onClick={onNewStory}>
                <PlusCircleTwoTone twoToneColor={"#191a24"} style={{fontSize: 30}} />
                <span style={{color: "#B1B8BEFF"}}>Ваша історія </span>
            </Flex>
            <Image.PreviewGroup       preview={{
                toolbarRender: (
                    _,
                    {

                        transform: { scale },
                        actions: { onFlipY, onFlipX, onRotateLeft, onRotateRight, onZoomOut, onZoomIn },
                        current
                    },
                ) => (
                    <Flex gap={25} className={classes.toolbarWrapper}>
                        <a href={getImageV2Url(stories[current].imageId)} style={{color: "white", textDecoration: "none"}}>
                            <DownloadOutlined style={{color: "white"}}  />

                        </a>
                        <RotateLeftOutlined onClick={onRotateLeft} />
                        <ZoomOutOutlined disabled={scale === 1} onClick={onZoomOut} />
                        <ZoomInOutlined disabled={scale === 50} onClick={onZoomIn} />
                    </Flex>
                ),
            }} >
                {stories.map((e) =>
                    <Flex key={"story-" + e.id} vertical>
                        <Image style={{border: "solid 2px", borderColor: "#389a3b", borderRadius: 10, position: "relative"}}
                               height={50}
                               src={getImageV2Url(e.imageId)}
                        />
                        <span style={{color: "#B1B8BEFF"}}>{e.author.firstName}</span>
                    </Flex>

                )}
            </Image.PreviewGroup>


            <NewStoryModal isOpen={isNewStoryModalOpen} setIsOpen={setIsNewStoryModalOpen}/>
        </Flex>
    );
};

export default StoriesList;