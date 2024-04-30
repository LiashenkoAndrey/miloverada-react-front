import React, {FC, useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import newsCardClasses from '../../components/NewsCard/NewsCard.module.css'
import mainPageClasses from '../MainPage/MainPage.module.css'
import {
    deleteNewsById,
    getLatestNews,
    getNewsById,
    getSimilarNews,
    incrementNewsViews,
    updateNewsById
} from "../../API/services/NewsService";


import {App, Breadcrumb, Button, Col, Flex, FloatButton, Image, Popconfirm, Row, Tooltip, Typography} from "antd";
import {INews, INewsImage} from "../../domain/NewsInt";
import './NewsPage.css'
import {
    CheckOutlined,
    CloseOutlined,
    FacebookOutlined,
    InstagramFilled,
    LeftOutlined,
    ShareAltOutlined,
    TwitterOutlined
} from "@ant-design/icons";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import NewsCard from "../../components/NewsCard/NewsCard";
import {useAuth0} from "@auth0/auth0-react";
import {AuthContext} from "../../context/AuthContext";
import EditMainTextModal from "./EditMainTextModal";
import NewsImageCarousel from "./NewsImageCarousel";
import NewsComments from "../../components/NewsComments/NewsComments";
import NewsNewCommentInput from "../../components/NewsNewCommentInput/NewsNewCommentInput";
import {getImageUrl} from "../../API/services/ImageService";
import {NOT_AUTH_MSG} from "../../API/Util";

const {  Title } = Typography;
interface NewsPageProps {
    isPreview : boolean
}

const NewsPage : FC<NewsPageProps> = ({isPreview}) => {

    const {preview} = useTypedSelector(state => state.newsPreview)

    const {id} = useParams();
    const [news, setNews] = useState<INews>()
    const [additionalNews, setAdditionalNews] = useState<INews[]>([])
    const [imagesList, setImagesList] = useState<INewsImage[]>([])
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
            setImagesList(news.images ? news.images : [])
            setDescription(news.description)
            setText(news.main_text)
            setDate(news.dateOfPublication)
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
        const {error} = await incrementNewsViews(id);
        if (error) throw error
    }

    useEffect(() => {
        if (isPreview) {
            const additionalNews : INews[]= []
            for (let i = 0; i < 3; i++) {
                additionalNews.push({main_text : "test", commentsAmount: 1, description : "Отимано автромобіль Volkswagen Kombi для Качкарівського ЦПМСД", id : i, newsType : {title:  "Допомога громаді", id: i, titleExplanation: "d"}, views: 100, images : [{mongoImageId: "64be864fd388a05bd4608ee2", newsId: i, id : i, fileName: "untitled"}]})
            }
            setAdditionalNews(additionalNews)
            setNews(preview)
            setDescription(news?.description)
            setText(news?.main_text)
            setDate(news?.dateOfPublication)
            console.log(preview.images)
            setImagesList(preview.images ? preview.images : [])
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
            if (error) {
                console.error(error)
            }
            console.log(data)
            setConfirmLoading(false);
            if (data) {
                notification.success({message: "Успішно видалено новину №" + news?.id})
                nav("/newsFeed/all")
            }
            if (error) throw error

        } else notification.warning(NOT_AUTH_MSG)
    }




    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [description, setDescription] = useState<string>()
    const [text, setText] = useState<string>()
    const [date, setDate] = useState<string>()
    const [isHasChanges, setIsHasChanges] = useState<boolean>(false)

    useEffect(() => {
        if (date !== news?.dateOfPublication  || description !== news?.description || text !== news?.main_text) {
            setIsHasChanges(true)
        } else {
            setIsHasChanges(false)
        }
    }, [date, text, description]);


    const onDateChanged = (e : string) => {
        const time = news?.dateOfPublication?.split("T")[1]
        const res = e + "T" + time
        setDate(res)
    }

    const saveChanges = async () => {
        if (text && description && date && jwt) {
            let formData = new FormData()
            formData.append("title", description)
            formData.append("text", text)
            formData.append("dateOfPublication", date)

            const {data ,error} = await updateNewsById(Number(id), formData, jwt)
            if (data) {
                setIsHasChanges(false)
                notification.success({message: "Зміни збережено", duration: 1})
            }
            if (error) {
                notification.error({message: "Виникла помилка при збереженні змін, будь ласка, спробуйте ще раз aбо зверніться до підтримки.", duration : 5})
                throw error
            }
        }
    }

    const removeChanges = async () => {
        setIsHasChanges(false)
        setDescription(news?.description)
        setText(news?.main_text)
        setDate(news?.dateOfPublication)
    }

    return (
        <Flex  justify={"center"}>
            {isHasChanges &&
                <Tooltip title="Ви маєте незбережені зміни, клікніть на кнопку щоб зберегти зміни." trigger="click" defaultOpen>
                    <FloatButton.Group shape="square" style={{right: 94}}>
                        <FloatButton onClick={saveChanges} type={"primary"} icon={<CheckOutlined/>}/>
                        <FloatButton onClick={removeChanges} icon={<CloseOutlined  />}/>
                    </FloatButton.Group>
                </Tooltip>
            }
            <Flex vertical={true} justify={"center"} className={"newsPage"} >


                {!isPreview &&
                    <Flex id={"newsTop"} justify={"space-between"}>
                        <Flex vertical={false} align={"center"}  gap={5} style={{marginBottom: 20}}>
                            <Button onClick={() => nav(-1)} style={{maxWidth: 150}} icon={<LeftOutlined />} type={"text"}>Назад</Button>
                            <Breadcrumb>
                                <Breadcrumb.Item><Button onClick={() => nav("/")} type={"text"} size={"small"}>Головна</Button> </Breadcrumb.Item>
                                <Breadcrumb.Item><Button onClick={() => nav("/newsFeed/all")}  type={"text"} size={"small"}>Новини</Button> </Breadcrumb.Item>
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



                {isAuthenticated && date && !isPreview
                    ?
                    <Title level={5}
                           style={{width: "fit-content"}}
                           className={"newsData"}
                           editable={{onChange: onDateChanged, triggerType: ["text"]}}
                    >
                        {date.split("T")[0]}
                    </Title>

                    :
                    <h6 className={"newsData"}>{news?.dateOfPublication?.split("T")[0]}</h6>
                }

                {isAuthenticated && !isPreview
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
                <Flex gap={20} wrap={"wrap"}>
                    <div style={{alignSelf: "flex-start"}}>
                        <Row style={{marginBottom: 10}}>
                            <Col><ShareAltOutlined className={"contact"} style={{fontSize: 31, marginRight: 5, cursor: "pointer"}}/></Col>
                            <Col><TwitterOutlined className={"contact"} style={{fontSize: 31, cursor: "pointer"}}/></Col>
                        </Row>
                        <Row>
                            <Col><InstagramFilled className={"contact"} style={{fontSize: 31, marginRight: 5, cursor: "pointer"}}/></Col>
                            <Col>
                                <a target={"_blank"} style={{color: "#343434"}} href="https://www.facebook.com/groups/2511266795585575">
                                    <FacebookOutlined className={"contact"} style={{fontSize: 31, cursor: "pointer"}}/>
                                </a>
                            </Col>
                        </Row>
                    </div>

                    {news?.image_id &&
                        <Image
                            style={{width: "100%", height: "100%", maxHeight : 540}}
                      className={"imageWithPlaceholder carouselImage"}
                            src={getImageUrl(news.image_id)} alt={news.description}/>

                    }

                    <NewsImageCarousel isPreview={isPreview}
                                       imagesList={imagesList}
                                       setImagesList={setImagesList}
                                       newsId={Number(id)}
                    />
                </Flex>

                {isAuthenticated && !isPreview
                    ?
                    <EditMainTextModal setText={setText} text={text}/>
                    :
                    text &&
                    <div className={"newsText"} dangerouslySetInnerHTML={{__html: text}}></div>
                }


                <span style={{display: "block"}} className={"newsPageViews"}>{news?.views} переглядів</span>
                <div style={{borderTop: "solid #c0c0bf 1px", margin: "20px 0"}}></div>

                {id &&
                    <Flex vertical style={{paddingBottom: 40}}>
                        <NewsComments newsId={Number(id)}/>
                        <NewsNewCommentInput newsId={Number(id)}/>
                    </Flex>
                }

                <Flex justify={"space-between"} wrap={"wrap"} gap={20}>
                    <Button onClick={() => nav("/newsFeed")} size={"large"} style={{fontSize: 18, height:"fit-content"}}>Новини громади</Button>

                    <Flex wrap={"wrap"} gap={10}>
                        <ShareAltOutlined onClick={() => navigator.share({url: "https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share"})} className={"contact"} style={{fontSize: 40, cursor: "pointer"}} />
                        <TwitterOutlined className={"contact"} style={{fontSize: 40, cursor: "pointer"}} />
                        <InstagramFilled className={"contact"} style={{fontSize: 40, cursor: "pointer"}} />
                        <a target={"_blank"} style={{color: "#343434"}} href="https://www.facebook.com/groups/2511266795585575">
                            <FacebookOutlined className={"contact"} style={{fontSize: 40, cursor: "pointer"}}/>
                        </a>
                    </Flex>
                </Flex>

                <h1 className={"whatReadNext"}>Що читати далі:</h1>

                <Flex justify={"center"} wrap={"wrap"} gap={20}>
                    {additionalNews.map((n) =>
                        <NewsCard  className={[mainPageClasses.wideNewsCard, newsCardClasses.wideNewsCard].join(' ')} news={n} key={"newsCa-" + n.id}/>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default NewsPage;