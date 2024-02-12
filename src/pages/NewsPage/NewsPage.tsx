import React, {FC, useContext, useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {
    deleteNewsById,
    deleteNewsImageById,
    getLatestNews,
    getNewsById,
    getSimilarNews,
    incrementNewsViews,
    saveNewsImageByNewsId
} from "../../API/services/NewsService";
import {App, Breadcrumb, Button, Col, Dropdown, Flex, Popconfirm, Row, Skeleton, Typography} from "antd";
import {INews} from "../../domain/NewsInt";
import {getImageUrl} from "../../API/services/ImageService";
import './NewsPage.css'
import {
    FacebookOutlined,
    InstagramFilled,
    LeftOutlined,
    PlusCircleOutlined,
    ShareAltOutlined,
    TwitterOutlined
} from "@ant-design/icons";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {Carousel} from "react-bootstrap";
// @ts-ignore
import imagePlaceholder from "../../assets/image-placeholder.svg"
import NewsCard from "../../components/NewsCard/NewsCard";
import {useAuth0} from "@auth0/auth0-react";
import {AuthContext} from "../../context/AuthContext";
import EditMainTextModal from "./EditMainTextModal";
const { Paragraph, Title } = Typography;

interface NewsPageProps {
    isPreview : boolean
}

const NewsPage : FC<NewsPageProps> = ({isPreview}) => {

    const {preview} = useTypedSelector(state => state.newsPreview)

    const {id} = useParams();
    const [news, setNews] = useState<INews>()
    const [additionalNews, setAdditionalNews] = useState<INews[]>([])
    const [imagesList, setImagesList] = useState<string[]>([])
    const nav = useNavigate();
    const {isAuthenticated} = useAuth0()
    const {jwt} = useContext(AuthContext)
    const {notification} = App.useApp();

    useEffect(() => {
        setNews(preview)
    }, [preview]);

    const getNews = async () => {
        const {data, error} = await getNewsById(Number(id))
        if (data) {
            const news : INews = data
            setNews(news)
            setImagesList(news.images ? news.images.map((img) => img.mongoImageId) : [])
            setDescription(news.description)
            setText(news.main_text)
        } else throw error
    }

    const getSimilarOrLatest = async () => {
        const {data, error} = await getSimilarNews(Number(id))
        if (data) {
            if (data.length > 0) {
                setAdditionalNews(data)
            } else {
                await getLatest()
            }
        }
        if (error) throw error
    }

    const getLatest = async () => {
        const {data, error} = await getLatestNews(3)
        if (data) {
            setAdditionalNews(data)
        } else throw error
    }

    const incrementViews = async (id : number) => {
        const {data, error} = await incrementNewsViews(id);
        if (data) {
            console.log("increment ok")
        } else throw error
    }

    useEffect(() => {
        if (isPreview) {
            const additionalNews : INews[]= []
            for (let i = 0; i < 3; i++) {
                additionalNews.push({main_text : "test", description : "Отимано автромобіль Volkswagen Kombi для Качкарівського ЦПМСД", id : 1, newsType : {title:  "Допомога громаді", id: 1, titleExplanation: "d"}, views: 100, images : [{mongoImageId: "64be864fd388a05bd4608ee2", newsId: 1, id : 1}]})
            }
            setAdditionalNews(additionalNews)
            setNews(preview)
            setImagesList(preview.previewImages)
        } else {
            getNews()
            document.getElementById("newsTop")?.scrollIntoView({block: "start", behavior: "smooth"})
            if (id !== undefined) {
                getNews();
                getSimilarOrLatest()

                setTimeout(() => {
                    incrementViews(Number(id))
                }, 5000)
            } else {
                console.log("id is null")
            }
        }
    }, [id]);

    const onDelete = async () => {
        if (jwt) {
            setConfirmLoading(true);
            const {data, error} = await deleteNewsById(Number(id), jwt)
            setConfirmLoading(false);
            if (data) {
                nav("/news/all")
            }
            if (error) throw error

        } else notification.warning({message: "not auth"})
    }

    const onImageDelete = async (id : string) => {
        if (id === '') return;
        if (jwt) {
            const {data, error} = await deleteNewsImageById(id, jwt)
            if (data) {
                console.log("deleted," ,data)
                console.log(imagesList)
                const filtered = imagesList.filter((img) => img !== id);
                console.log("filter",filtered)

                setImagesList(filtered)
            }
            if (error) throw error
        } else notification.warning({message: "not auth"})
    }

    const inputFile = useRef<HTMLInputElement | null>(null)
    const [isNewImageLoading, setIsNewImageLoading] = useState(false);


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
                const {data, error} = await saveNewsImageByNewsId(formData, Number(id), jwt)
                setIsNewImageLoading(false)
                if (data) {
                    console.log("ok",data)
                    setImagesList([...imagesList, ...data])
                }
                if (error) throw error
            } else notification.warning({message: "not auth"})
        }
    }

    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [description, setDescription] = useState<string>()
    const [text, setText] = useState<string>()

    return (
        <Flex justify={"center"}>
            <Flex vertical={true} justify={"center"} id={"newsTop"} className={"newsPage"} >
                {!isPreview &&
                    <Flex justify={"space-between"}>
                        <Flex vertical={false} align={"center"}  gap={5} style={{marginBottom: 20}}>
                            <Button onClick={() => nav(-1)} style={{maxWidth: 150}} icon={<LeftOutlined />} type={"text"}>Назад</Button>
                            <Breadcrumb>
                                <Breadcrumb.Item><Button onClick={() => nav("/")} type={"text"} size={"small"}>Головна</Button> </Breadcrumb.Item>
                                <Breadcrumb.Item><Button type={"text"} size={"small"}>Новини</Button> </Breadcrumb.Item>
                            </Breadcrumb>
                        </Flex>
                        {isAuthenticated &&
                            <Popconfirm
                                title="Видалити"
                                description="Ви впевнені? Дія незворотня."
                                open={deleteConfirmOpen}
                                onConfirm={onDelete}
                                okButtonProps={{ loading: confirmLoading }}
                                onCancel={() => setDeleteConfirmOpen(false)}
                            >
                                <Button type="primary" onClick={() => setDeleteConfirmOpen(true)}>
                                    Видалити
                                </Button>
                            </Popconfirm>
                        }
                    </Flex>
                }

                <h6 className={"newsData"}>{news?.dateOfPublication?.split("T")[0]}</h6>

                {isAuthenticated
                    ?

                    <Title className={"newsTitle"}
                           editable={{onChange: setDescription, triggerType: ["text"]}}
                    >
                        {description}
                    </Title>

                    :
                    <h1 className={"newsTitle"}>{news?.description}</h1>
                }

                <div style={{borderTop: "solid #c0c0bf 1px", margin: "20px 0"}}></div>
                <Flex gap={20}>
                    <div style={{alignSelf: "flex-start"}}>
                        <Row style={{marginBottom: 10}}>
                            <Col><ShareAltOutlined style={{fontSize: 31, marginRight: 5, cursor: "pointer"}}/></Col>
                            <Col><TwitterOutlined style={{fontSize: 31, cursor: "pointer"}}/></Col>
                        </Row>
                        <Row>
                            <Col><InstagramFilled style={{fontSize: 31, marginRight: 5, cursor: "pointer"}}/></Col>
                            <Col><FacebookOutlined style={{fontSize: 31, cursor: "pointer"}}/></Col>
                        </Row>
                    </div>

                    <Flex style={{position: "relative"}}>

                        <Carousel style={{maxWidth: 800}}>
                            {imagesList.map((img) =>
                                <Carousel.Item key={"image-" +( img.length > 100 ? img.substring(0, 90) : img)}>
                                    <Flex align={"center"} style={{width: 800, maxWidth: 800, height: 540, backgroundColor: "rgba(44,44,44,0.44)"}}>
                                        <Dropdown placement={"topLeft"}
                                                  disabled={isPreview || imagesList.length <= 1}
                                                  menu={{ items: [
                                                          {
                                                              label: "Видалити зоображення",
                                                              key: "deleteNewsImageOption-" + img.substring(0,40),
                                                              style: {zIndex: 2147483647},
                                                              danger: true}
                                                      ],
                                                      onClick : () => onImageDelete(isPreview ? "" : img)
                                                  }}
                                                  trigger={['contextMenu']}
                                        >
                                            <img style={{width: "100%", height: "100%", maxHeight : 540}}
                                                 alt={"Картинка"}
                                                 src={getImageUrl(img)}
                                            />
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

                        <Button ghost loading={isNewImageLoading}
                                icon={<PlusCircleOutlined />}
                                style={{ position: "absolute", bottom: 20, left: 20, zIndex: 214748364}}
                                onClick={onImageAdd}
                        >
                            Додати
                        </Button>
                    </Flex>
                </Flex>


                {isAuthenticated
                    ?
                    <EditMainTextModal setText={setText} text={text}/>
                    :
                    news?.main_text &&
                    <div className={"newsText"} dangerouslySetInnerHTML={{__html: news?.main_text}}></div>

                }


                <span style={{display: "block"}} className={"newsPageViews"}>{news?.views} переглядів</span>
                <div style={{borderTop: "solid #c0c0bf 1px", margin: "20px 0"}}></div>


                <Flex justify={"space-between"}>
                    <Button size={"large"} style={{fontSize: 18, height:"fit-content"}}>Новини громади</Button>

                    <Flex wrap={"wrap"} gap={10}>
                        <ShareAltOutlined style={{fontSize: 40, cursor: "pointer"}} />
                        <TwitterOutlined style={{fontSize: 40, cursor: "pointer"}} />
                        <InstagramFilled style={{fontSize: 40, cursor: "pointer"}} />
                        <FacebookOutlined style={{fontSize: 40, cursor: "pointer"}}/>
                    </Flex>
                </Flex>

                <h1 className={"whatReadNext"}>Що читати далі:</h1>

                <Flex justify={"center"} wrap={"wrap"} gap={20}>
                    {additionalNews.map((n) =>
                        <NewsCard  className={"whiteNewsCard AllNewsPageCard"} news={n} key={"newsCa-" + n.id}/>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default NewsPage;