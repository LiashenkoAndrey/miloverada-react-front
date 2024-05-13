import React, {useEffect, useState} from 'react';
import {getLatestNews} from "../../API/services/NewsService";
import {Button, Flex, List, Select} from "antd";
import classes from './AllNewsPage.module.css'
import newsCardClasses from '../../components/NewsCard/NewsCard.module.css'
import NewsCard from "../../components/NewsCard/NewsCard";
import {INewsDto} from "../../domain/NewsInt";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

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
                console.log(data.totalElements)
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
        console.log(res)
        setBottomNews(res)
    }

    const onPageChanged = async (pageNum : number) => {
        console.log("page: ", pageNum)
        console.log("")
        const pageStartIndex = pageNum * BOTTOM_PAGE_SIZE - 6;
        console.log(pageStartIndex)
        if (bottomNews[pageStartIndex].id === null) {
            console.log(`This page (${pageNum}) is not loaded yet!`)
            console.log("Start loading...")
            const page = await getNewsPage(pageNum);
            const news = page.news;
            let startIndex = pageStartIndex;
            console.log(news)
            for (let i = 0; i < news.length; i++) {
                console.log("set news ", news[1], "to index "+ startIndex, " => "+ bottomNews[startIndex])
                bottomNews[startIndex] = news[i];
                startIndex++;
            }
            console.log(page)
            console.log(bottomNews)
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
                {isAuthenticated &&
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
                <Flex justify={"space-between"} style={{backgroundColor :"#2d313d", padding: "10px 20px",border: "solid black 1px", borderRadius: 20, height: 100}}>
                    <span className={classes.newsTitle} style={{color: "white", fontSize: 40}}>Новини</span>
                    {/*<Flex style={{alignSelf: "end"}}>*/}

                    {/*    <Flex gap={5}>*/}

                    {/*        <Select placeholder={"Сортування по"}*/}
                    {/*                style={{width: 170}}*/}
                    {/*                options={[*/}
                    {/*                    { value: 'popular', label: 'По популярності' },*/}
                    {/*                    { value: 'date', label: 'По даті' },*/}
                    {/*                ]}*/}
                    {/*        />*/}
                    {/*        <Select defaultValue={"asc"}*/}
                    {/*                options={[*/}
                    {/*                    { value: 'asc', label: 'По зростанню' },*/}
                    {/*                    { value: 'desc', label: 'По спаданню' },*/}
                    {/*                ]}*/}
                    {/*        />*/}
                    {/*    </Flex>*/}
                    {/*</Flex>*/}
                </Flex>

                {/*<div className={classes.bottomNewsList}>*/}
                {/*    {news.slice(5, news.length).map((n) =>*/}
                {/*        <NewsCard className={[classes.AllNewsPageBottomCard, classes.WhiteNewsCard].join(' ')}*/}
                {/*                  news={n}*/}
                {/*                  key={"newsCa-" + n.id}/>*/}
                {/*    )}*/}
                {/*</div>*/}

                <List

                    style={{margin: 5}}
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