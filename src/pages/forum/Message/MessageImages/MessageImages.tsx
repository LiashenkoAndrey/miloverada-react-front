import React, {FC, useContext} from 'react';
import {App, Dropdown, Image, MenuProps} from "antd";
import PhotoAlbum, {Photo} from "react-photo-album";
import {DeleteMessageImageDto, Message, MessageImage} from "../../../../API/services/forum/ForumInterfaces";
import {getForumImageUrl} from "../../../../API/services/ImageService";
import {useAuth0} from "@auth0/auth0-react";
import {deleteMessageImageById} from "../../../../API/services/forum/MessageImageService";
import {AuthContext} from "../../../../context/AuthContext";
import {useStompClient} from "react-stomp-hooks";
import {useTypedSelector} from "../../../../hooks/useTypedSelector";

interface MessageImagesProps {
    message : Message
}


const MessageImages : FC<MessageImagesProps> = ({message}) => {
    const {chatId} = useTypedSelector(state => state.chat)
    const {isAuthenticated} = useAuth0()
    const {jwt} = useContext(AuthContext)
    const {notification} = App.useApp();
    const stompClient = useStompClient()

    function getImageMenu(imageId : string | undefined) {
        if (imageId) {

            const imageMenu: MenuProps['items'] = [
                {
                    label: 'Видалити зоображеня',
                    key: 'delete-' + imageId,
                    danger : true
                },
            ];
            return imageMenu
        }
    }

    const onSelectImageAction: MenuProps['onClick'] = ({key})   => {
        console.log("image action |", key)
        let arr = key.split("-")
        doImageAction(arr[0], arr[1])
    }

    async function doImageAction(action : string, imageId : string) {

        if (jwt) {
            switch (action) {
                case 'delete':
                    if (message.id) {
                        const {error} = await deleteMessageImageById(imageId, message.id, jwt)
                        if (error) {
                            notification.error({message : "can't update message image"})
                        } else {
                            notifyThatMessageImageWasDeleted(message.id, imageId)
                            notification.success({message : "Видалено успішно"})
                        }
                    }
            }
        }
    }

    const notifyThatMessageImageWasDeleted = (messageId : number, imageId : string) => {
        if (stompClient && chatId) {
            const body : DeleteMessageImageDto = {
                messageId : messageId,
                imageId : imageId,
                chatId : chatId
            }

            stompClient.publish({
                destination : "/app/userMessage/image/wasDeleted",
                body : JSON.stringify(body)
            })
        } else notification.error({message : "can't notify that deleted message"})
    }


    function getImagesSources(list : MessageImage[]) : Photo[] {
        return list.map((img)  => {
            return {src : getForumImageUrl(img.imageId), width : -1, height : -1, key : img.imageId} as  Photo
        })
    }

    return (
        message?.imagesList !== null
            ?
                <PhotoAlbum
                    layout="rows"
                    padding={10}
                    photos={getImagesSources(message.imagesList)}
                    renderPhoto={({ photo}) => (
                        <Dropdown disabled={!isAuthenticated} menu={{items : getImageMenu(photo.key), onClick : onSelectImageAction}} trigger={['contextMenu']}>
                            <Image style={{padding : 5, maxHeight: 250, maxWidth: 350}}  src={photo.src}/>
                        </Dropdown>
                    )}
                />
            :
            <></>
    )
};

export default MessageImages;