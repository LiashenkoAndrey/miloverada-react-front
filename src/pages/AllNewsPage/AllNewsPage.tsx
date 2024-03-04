import React, {useEffect, useState} from 'react';
import {getLatestNews} from "../../API/services/NewsService";
import {Button, Flex} from "antd";
import classes from './AllNewsPage.module.css'
import newsCardClasses from '../../components/NewsCard/NewsCard.module.css'
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
        <Flex align={"center"}
              justify={"center"}
              className={classes.allnewsWrapper}
        >
            <Flex gap={20}
                  vertical
                  className={classes.wrapper2}
            >
                <Flex justify={"end"} style={{margin: 20}}>
                    <Button type={"primary"}
                            onClick={() => nav("/news/new")}
                    >Нова новина
                    </Button>
                </Flex>


                    {news.length > 0
                        ?
                        <Flex align={"center"}
                              justify={"center"}
                              className={classes.topNewsListWrapper}
                        >
                            <Flex gap={50} vertical>

                                <NewsCard
                                    news={news[0]}
                                    className={[newsCardClasses.wideNewsCard, newsCardClasses.wideNewsCard, classes.WideNewsCard].join(" ")}
                                />
                            </Flex>

                            <div className={classes.topNewsList}>
                                {news.slice(1, 5).map((newsItem) =>
                                    <NewsCard className={[classes.WhiteNewsCard ].join(' ')}
                                              news={newsItem}
                                              key={"newsTop-" + newsItem.id}/>
                                )}
                            </div>


                        </Flex>
                        :
                        <></>
                    }

                <div className={classes.bottomNewsList} >
                    {news.slice(5, news.length).map((n) =>
                        <NewsCard className={[classes.AllNewsPageBottomCard, classes.WhiteNewsCard ].join(' ')}
                                  news={n}
                                  key={"newsCa-" + n.id}/>
                    )}
                </div>
            </Flex>
        </Flex>
    );
};

export default AllNewsPage;