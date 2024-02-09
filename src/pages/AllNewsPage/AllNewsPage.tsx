import React, {useEffect, useState} from 'react';
import {getLatestNews} from "../../API/services/NewsService";
import {Button, Flex} from "antd";
import './AllNewsPage.css'
import NewsList from "../../components/NewsList/NewsList";
import NewsCard from "../../components/NewsCard/NewsCard";
import {INewsDto} from "../../domain/NewsInt";
import {useNavigate} from "react-router-dom";

const AllNewsPage = () => {

    const [news, setNews] = useState<INewsDto[]>([])
    const nav = useNavigate()

    useEffect(() => {
        const getNews = async () => {
            const {data, error} = await getLatestNews(20)
            if (data) {
                setNews(data)
            } else throw error
        }
        getNews()
    }, []);

    return (
        <Flex align={"center"} justify={"center"} className={"allnewsWrapper"}>
            <Flex gap={20} style={{maxWidth: "90vw"}} vertical>
                <Flex justify={"end"} style={{margin: 20}}>
                    <Button type={"primary"} onClick={() => nav("/news/new")}>Нова новина</Button>
                </Flex>


                    {news.length > 0
                        ?
                        <Flex className={"NewsWrapper"} align={"center"} justify={"center"}>
                            <NewsCard
                                      news={news[0]}
                                      className={"wideNewsCard AllNewsPageWideCard"}
                            />
                            <NewsList name={"AllNewsList"} newsList={news.slice(1, 5)}/>
                        </Flex>
                        :
                        <></>
                    }

                <Flex justify={"center"} wrap={"wrap"} gap={20}>
                    {news.map((n) =>
                        <NewsCard className={"whiteNewsCard AllNewsPageCard"} news={n} key={"newsCa-" + n.id}/>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default AllNewsPage;