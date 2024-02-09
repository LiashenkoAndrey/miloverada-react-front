import React, {FC, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {getLatestNews, getNewsById, getSimilarNews, incrementNewsViews} from "../../API/services/NewsService";
import {Breadcrumb, Button, Col, Flex, Row, Skeleton} from "antd";
import {INews} from "../../domain/NewsInt";
import {getImageUrl} from "../../API/services/ImageService";
import './NewsPage.css'
import {FacebookOutlined, InstagramFilled, LeftOutlined, ShareAltOutlined, TwitterOutlined} from "@ant-design/icons";
import NewsList from "../../components/NewsList/NewsList";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {Carousel} from "react-bootstrap";
// @ts-ignore
import imagePlaceholder from "../../assets/image-placeholder.svg"

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

    useEffect(() => {
        setNews(preview)
    }, [preview]);

    const getNews = async () => {
        const {data, error} = await getNewsById(Number(id))
        if (data) {
            const news : INews = data
            setNews(news)
            setImagesList(news.images ? news.images.map((img) => getImageUrl(img.mongoImageId)) : [])
        } else throw error
    }

    const getSimilarOrLatest = async () => {
        const {data, error} = await getSimilarNews(Number(id))
        if (data) {
            console.log(data, data.length)
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
    }, []);


    return (
        <Flex justify={"center"}>
            <Flex vertical={true} justify={"center"}  className={"newsPage"} >
                {!isPreview &&
                    <Flex vertical={false} align={"center"}  gap={5} style={{marginBottom: 20}}>
                        <Button onClick={() => nav(-1)} style={{maxWidth: 150}} icon={<LeftOutlined />} type={"text"}>Назад</Button>
                        <Breadcrumb>
                            <Breadcrumb.Item><Button onClick={() => nav("/")} type={"text"} size={"small"}>Головна</Button> </Breadcrumb.Item>
                            <Breadcrumb.Item><Button type={"text"} size={"small"}>Новини</Button> </Breadcrumb.Item>
                        </Breadcrumb>
                    </Flex>
                }

                <h6 className={"newsData"}>{news?.created}</h6>

                <h1 className={"newsTitle"}>{news?.description}</h1>
                <div style={{borderTop: "solid #c0c0bf 1px", margin: "20px 0"}}></div>
                <Flex gap={20}>
                    <div  style={{alignSelf: "flex-start"}}>
                        <Row style={{marginBottom: 10}}>
                            <Col><ShareAltOutlined style={{fontSize: 31, marginRight: 5, cursor: "pointer"}}/></Col>
                            <Col><TwitterOutlined style={{fontSize: 31, cursor: "pointer"}}/></Col>
                        </Row>
                        <Row>
                            <Col><InstagramFilled style={{fontSize: 31, marginRight: 5, cursor: "pointer"}}/></Col>
                            <Col><FacebookOutlined style={{fontSize: 31, cursor: "pointer"}}/></Col>
                        </Row>
                    </div>

                    <Carousel style={{maxWidth: 800}}>
                        {imagesList.map((img) =>
                            <Carousel.Item>
                                <Flex align={"center"} style={{width: 800, maxWidth: 800, height: "100%", minHeight: 800, backgroundColor: "black"}}>
                                    <img style={{width: "100%", height: "100%"}} src={img}/>

                                </Flex>
                            </Carousel.Item>
                        )}
                    </Carousel>
                </Flex>

                {news?.main_text
                    ?
                    <div className={"newsText"} dangerouslySetInnerHTML={{__html: news?.main_text}}></div>
                    :
                    <Skeleton active/>
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
                <NewsList newsList={additionalNews}/>
            </Flex>
        </Flex>
    );
};

export default NewsPage;