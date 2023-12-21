import React, {useEffect, useState} from 'react';
import {getLatestNews} from "../../API/services/NewsService";
import {Flex} from "antd";
import './AllNewsPage.css'
import NewsList from "../../components/NewsList/NewsList";
import NewsCard from "../../components/NewsCard/NewsCard";
import {INews} from "../../domain/NewsInt";

const AllNewsPage = () => {

    const [news, setNews] = useState([])


    useEffect(() => {
        const getNews = async () => {
            const {data, error} = await getLatestNews(5)
            if (data) {
                console.log(news)
                setNews(data)
            } else throw error
        }
        getNews()
    }, []);

    return (
        <Flex align={"center"} justify={"center"} className={"allnewsWrapper"}>
            <Flex style={{maxWidth: "90vw"}}>
                {news.length > 0
                    ?
                    <Flex className={"NewsWrapper"}>
                        <NewsCard style={{maxHeight: 730, maxWidth:570}}
                                  description={(news[0] as INews).description}
                                  image_id={(news[0] as INews).image_id}
                                  id={(news[0] as INews).id}
                                  newsType={(news[0] as INews).newsType}
                        />
                        <NewsList name={"AllNewsList"} newsList={news.slice(1)}/>
                    </Flex>
                    :
                    <></>
                }

            </Flex>
        </Flex>
    );
};

export default AllNewsPage;