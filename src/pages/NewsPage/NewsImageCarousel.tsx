import React, {FC, useContext, useRef, useState} from 'react';
import {Carousel} from "react-bootstrap";
import {App, Button, Dropdown, Flex} from "antd";
import {getImageUrl} from "../../API/services/ImageService";
import {PlusCircleOutlined} from "@ant-design/icons";
import {INewsImage} from "../../domain/NewsInt";
import {deleteNewsImageById, saveNewsImageByNewsId} from "../../API/services/NewsService";
import {AuthContext} from "../../context/AuthContext";
import {useAuth0} from "@auth0/auth0-react";

interface NewsImageCarouselProps {
    isPreview : boolean
    imagesList : INewsImage[]
    setImagesList: React.Dispatch<React.SetStateAction<INewsImage[]>>
    newsId : number
}

const NewsImageCarousel:FC<NewsImageCarouselProps> = ({isPreview, imagesList, setImagesList, newsId}) => {

    const [isNewImageLoading, setIsNewImageLoading] = useState(false);
    const inputFile = useRef<HTMLInputElement | null>(null)
    const {jwt} = useContext(AuthContext)
    const {notification} = App.useApp();
    const {isAuthenticated} = useAuth0()

    const onImageDelete = async (id : string) => {
        if (id === '') return;
        if (jwt) {
            const {data, error} = await deleteNewsImageById(id, jwt)
            if (data) {
                const filtered = imagesList.filter((img) => img.mongoImageId !== id);
                setImagesList(filtered)
            }
            if (error) throw error
        } else notification.warning({message: "not auth"})
    }


    const onImageAdd = () => {
        inputFile.current?.click()
    }

    const onImageLoad = async (fileList: FileList | null) => {
        if (fileList !== null) {
            if (jwt) {
                let formData = new FormData()
                for (let i = 0; i < fileList.length; i++) {
                    formData.append("images", fileList[i])
                }
                setIsNewImageLoading(true)
                const {data, error} = await saveNewsImageByNewsId(formData, newsId, jwt)
                setIsNewImageLoading(false)
                if (data) {
                    setImagesList([...imagesList, ...data])
                }
                if (error) throw error
            } else notification.warning({message: "not auth"})
        }
    }

    return (
        <Flex style={{position: "relative"}}>
            <Carousel controls={imagesList.length > 1} indicators={imagesList.length > 1} slide={true} style={{maxWidth: 800}}>
                {imagesList.map((img) =>
                    <Carousel.Item key={"image-" + img.fileName}>
                        <Flex align={"center"} className={"carouselImgWrapper"}>
                            <Dropdown placement={"topLeft"}
                                      disabled={isPreview || imagesList.length <= 1}
                                      menu={{ items: [
                                              {
                                                  label: "Видалити зоображення",
                                                  key: "deleteNewsImageOption-" + img.fileName,
                                                  style: {zIndex: 2147483647},
                                                  danger: true}
                                          ],
                                          onClick : () => onImageDelete(isPreview ? "" : img.mongoImageId)
                                      }}
                                      trigger={['contextMenu']}
                            >
                                <div style={{width : "100%", height: "100%"}}>

                                    <img style={{width: "100%", height: "100%", maxHeight : 540}}
                                         alt={"Картинка"} className={"imageWithPlaceholder carouselImage"}
                                         src={ isPreview ? img.mongoImageId : getImageUrl(img.mongoImageId)}
                                    />
                                </div>
                            </Dropdown>
                        </Flex>
                    </Carousel.Item>
                )}
            </Carousel>
            <input multiple
                   onChange={(e) => onImageLoad(e.target.files)}
                   style={{display: "none"}}
                   ref={inputFile}
                   type="file"
            />

            {isAuthenticated &&
                <Button ghost loading={isNewImageLoading}
                        icon={<PlusCircleOutlined />}
                        style={{ position: "absolute", bottom: 20, left: 20, zIndex: 214748364}}
                        onClick={onImageAdd}
                >
                    Додати
                </Button>
            }
        </Flex>
    );
};

export default NewsImageCarousel;