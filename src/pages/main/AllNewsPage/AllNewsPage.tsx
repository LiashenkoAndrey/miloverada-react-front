import React, {useContext, useEffect, useState} from 'react';
import {getLatestNews} from "../../../API/services/main/NewsService";
import {Button, Flex, List} from "antd";
import classes from './AllNewsPage.module.css'
import newsCardClasses from '../../../components/main/news/NewsCard/NewsCard.module.css'
import NewsCard from "../../../components/main/news/NewsCard/NewsCard";
import {INewsDto} from "../../../domain/NewsInt";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import {checkPermission} from "../../../API/Util";
import {AuthContext} from "../../../context/AuthContext";

export interface INewsPage {
    news : INewsDto[]
    totalElements : number
}

const AllNewsPage = () => {
    const BOTTOM_PAGE_SIZE = 6;
    const [topNews, setTopNews] = useState<INewsDto[]>([])
    const [bottomNews, setBottomNews] = useState<INewsDto[]>([])
    const nav = useNavigate()
    const {isAuthenticated} = useAuth0()
    const {jwt} = useContext(AuthContext)

    useEffect(() => {
        const getNews = async () => {
            const {data, error} = await getLatestNews(5)
            if (data) {
                setTopNews(data.news)
            } else throw error
        }
        getNews()
    }, []);

    useEffect(() => {
        const getBottomNews = async () => {
            const {data, error} = await getLatestNews(BOTTOM_PAGE_SIZE, 0)
            if (data) {
                fillMockNews(data)
            } else throw error
        }
        getBottomNews()
    }, []);

    const getNewsPage = async (pageNum : number) => {
        const {data, error} = await getLatestNews(BOTTOM_PAGE_SIZE, pageNum)
        if (data) {
            return data;
        } else throw error
    }

    const fillMockNews = (page : any) => {
        const res =[...page.news ,...Array.from({length: page.totalElements - BOTTOM_PAGE_SIZE - BOTTOM_PAGE_SIZE}, (v, i) => {return {id : null, description : null}})];
        setBottomNews(res)
    }

    const onPageChanged = async (pageNum : number) => {
        const pageStartIndex = pageNum * BOTTOM_PAGE_SIZE - 6;
        if (bottomNews[pageStartIndex].id === null) {
            const page = await getNewsPage(pageNum);
            const news = page.news;
            let startIndex = pageStartIndex;
            for (let i = 0; i < news.length; i++) {
                bottomNews[startIndex] = news[i];
                startIndex++;
            }
            setBottomNews([...bottomNews])

        }
    }

    return (
        <Flex align={"center"}
              justify={"center"}
              className={classes.allnewsWrapper}
        >
            <Flex gap={20}
                  vertical
                  className={classes.wrapper2}
            >
                {checkPermission(jwt, "admin") &&
                    <Flex justify={"end"} style={{margin: 20}}>
                        <Button type={"primary"}
                                onClick={() => nav("/news/new")}
                        >Нова новина
                        </Button>
                    </Flex>
                }


                {topNews.length > 0 &&
                    <Flex align={"center"}
                          justify={"center"}
                          className={classes.topNewsListWrapper}
                    >
                        <Flex gap={50} vertical>

                            <NewsCard
                                news={topNews[0]}
                                className={[newsCardClasses.wideNewsCard, newsCardClasses.wideNewsCard, classes.WideNewsCard].join(" ")}
                            />
                        </Flex>

                        <div className={classes.topNewsList}>
                            {topNews.slice(1, 5).map((newsItem) =>
                                <NewsCard className={[classes.WhiteNewsCard].join(' ')}
                                          news={newsItem}
                                          key={"newsTop-" + newsItem.id}/>
                            )}
                        </div>
                    </Flex>
                }
                <Flex justify={"space-between"}
                      style={{backgroundColor :"#2d313d", padding: "10px 20px",border: "solid black 1px", borderRadius: 20, height: 100}}
                >
                    <span className={classes.newsTitle} style={{color: "white", fontSize: 40}}>Новини</span>
                </Flex>

                <List style={{margin: 5}}
                    pagination={{
                        showSizeChanger : false,
                        onChange: onPageChanged,
                        pageSize: 6,
                        align : 'center'
                    }}
                    grid={{
                        gutter: 16,
                        column: 4,
                        xs: 2,
                        sm: 2,
                        md: 2,
                        lg: 3,
                        xl: 3,
                        xxl: 3,

                    }}
                    dataSource={bottomNews}
                    renderItem={(n) => (
                        <div>
                            <NewsCard className={[classes.AllNewsPageBottomCard, classes.WhiteNewsCard].join(' ')}
                                      news={n}
                                      key={"newsCa-" + n.id}/>

                        </div>
                    )}
                />
            </Flex>
        </Flex>
    );
};

export default AllNewsPage;