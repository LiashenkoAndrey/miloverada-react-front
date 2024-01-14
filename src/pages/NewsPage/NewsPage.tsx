import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {getLatestNews, getNewsById, getSimilarNews, incrementNewsViews} from "../../API/services/NewsService";
import {Breadcrumb, Button, Col, Flex, Image, Row, Skeleton} from "antd";
import {INews} from "../../domain/NewsInt";
import {getImageUrl} from "../../API/services/ImageService";
import './NewsPage.css'
import {FacebookOutlined, InstagramFilled, LeftOutlined, ShareAltOutlined, TwitterOutlined} from "@ant-design/icons";
import NewsList from "../../components/NewsList/NewsList";

const NewsPage = () => {

    const {id} = useParams();
    const [news, setNews] = useState<INews>()
    const [additionalNews, setAdditionalNewsNews] = useState()
    const nav = useNavigate();

    const getNews = async () => {
        const {data, error} = await getNewsById(Number(id))
        if (data) {
            setNews(data)
        } else throw error
    }

    const getSimilarOrLatest = async () => {
        const {data, error} = await getSimilarNews(Number(id))
        if (data) {
            console.log(data, data.length)
            if (data.length > 0) {
                setAdditionalNewsNews(data)
            } else {
                await getLatest()
            }
        }
        if (error) throw error
    }

    const getLatest = async () => {
        console.log("LAtest!")
        const {data, error} = await getLatestNews(3)
        if (data) {
            console.log(data, "latest")
            setAdditionalNewsNews(data)
        } else throw error
    }

    const incrementViews = async (id : number) => {
        const {data, error} = await incrementNewsViews(id);
        if (data) {
            console.log("increment ok")
        } else throw error
    }

    useEffect(() => {
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
    }, []);

    return (
        <Flex justify={"center"}>
            <Flex vertical={true} justify={"center"}  className={"newsPage"} style={{maxWidth: "60vw"}}>
                <Flex vertical={false} align={"center"}  gap={30} style={{marginBottom: 20}}>
                    <Button onClick={() => nav(-1)} style={{maxWidth: 150}} icon={<LeftOutlined />} type={"text"}>Назад</Button>
                    <Breadcrumb>
                        <Breadcrumb.Item><Button onClick={() => nav("/")} type={"text"} size={"small"}>Головна</Button> </Breadcrumb.Item>
                        <Breadcrumb.Item><Button type={"text"} size={"small"}>Новини</Button> </Breadcrumb.Item>
                    </Breadcrumb>
                </Flex>

                <h6 className={"newsData"}>{news?.created}</h6>

                <h1 className={"newsTitle"}>{news?.description}</h1>
                <div style={{borderTop: "solid #c0c0bf 1px", margin: "20px 0"}}></div>
                <Flex gap={20}>
                    <div  style={{alignSelf: "flex-start"}}>
                        <Row style={{marginBottom: 10}}>
                            <Col><ShareAltOutlined style={{fontSize: 31, marginRight: 5, cursor: "pointer"}} /></Col>
                            <Col><TwitterOutlined style={{fontSize: 31, cursor: "pointer"}} /></Col>
                        </Row>
                        <Row>
                            <Col><InstagramFilled style={{fontSize: 31, marginRight: 5, cursor: "pointer"}} /></Col>
                            <Col><FacebookOutlined style={{fontSize: 31, cursor: "pointer"}}/></Col>
                        </Row>
                    </div>
                    <Image  style={{maxHeight: 700}} src={getImageUrl(news?.image_id)}/>
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

                    <Flex gap={10}>
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