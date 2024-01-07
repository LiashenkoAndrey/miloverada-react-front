import React, {FC, MouseEventHandler, useEffect, useRef} from 'react';
import {Dropdown, Flex, Image, MenuProps} from "antd";
import {toTime} from "../../../API/Util";
import {Message, MessageImage} from "../../../API/services/forum/ForumInterfaces";
import {useAuth0} from "@auth0/auth0-react";
import PhotoAlbum, {Photo} from "react-photo-album";
import {getForumImageUrl} from "../../../API/services/ImageService";

interface MessageProps {
    message : Message
    observer? : IntersectionObserver
    onMessageRightClick : MouseEventHandler<HTMLElement>
}

const MessageListItem: FC<MessageProps> = ({message, observer, onMessageRightClick}) => {
    const messageRef = useRef(null)
    const {isAuthenticated} = useAuth0()

    useEffect(() => {
        if (isAuthenticated) {
            if (observer && messageRef.current) {
                observer.observe(messageRef.current)
            } else {
                console.log("one is null", observer, messageRef.current)
            }
        }
    }, [messageRef]);

    function getImagesSources(list : MessageImage[]) : Photo[] {
        return list.map((img)  => {
            return {src : getForumImageUrl(img.imageId), width : -1, height : -1} as  Photo
        })
    }

    const items: MenuProps['items'] = [
        {
            label: 'Відповісти',
            key: '1',
        },
        {
            label: 'Редагувати',
            key: '2',
        },
        {
            label: 'Видалити',
            key: '3',
            danger : true

        },
    ];

    return (
        <Dropdown disabled={!isAuthenticated} menu={{ items }} trigger={['contextMenu']}>
            <Flex ref={messageRef} className={"message"} id={"msgId-" + message.id} gap={8}>
                <div style={{marginTop: 4}}>
                    <Image preview={false} style={{cursor: "pointer"}} className={"messageImg nonSelect"} width={35} height={35} src={message.sender.avatar}/>
                </div>

                <Flex vertical={true} >
                    <Flex style={{position: "relative"}} className={"nonSelect"} gap={5} align={"center"}
                          justify={"space-between"}>
                        <span className={"senderName"}>{message.sender.name}</span>
                        <span className={"messageDate"}
                              style={{margin: 0, alignSelf: "flex-end"}}>{toTime(message.createdOn)}</span>
                    </Flex>
                    <Flex vertical style={{marginTop: 3}}>
                        <span style={{fontWeight: "bold", display: "block"}}>{message.id}</span>
                        {message.imagesList !== null &&
                            <PhotoAlbum
                                layout="rows"
                                padding={10}
                                photos={getImagesSources(message.imagesList)}
                                renderPhoto={({ photo}) => (
                                    <Image style={{padding : 5, maxHeight: 250, maxWidth: 350}}  src={photo.src}/>
                                )}
                            />
                        }
                        <span className={"messageText"}
                              style={{margin: 0, alignSelf: "flex-end"}}>{message.text}
                    </span>
                    </Flex>
                </Flex>


            </Flex>
        </Dropdown>

    );
};

export default MessageListItem;