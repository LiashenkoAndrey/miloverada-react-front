import React, {useEffect, useState} from 'react';
import {getLatestNews} from "../../API/services/NewsService";
import {Button, Flex, List, Select} from "antd";
import classes from './AllNewsPage.module.css'
import newsCardClasses from '../../components/NewsCard/NewsCard.module.css'
import NewsCard from "../../components/NewsCard/NewsCard";
import {INewsDto} from "../../domain/NewsInt";
import {useNavigate} from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

const AllNewsPage = () => {

    const [news, setNews] = useState<INewsDto[]>([])
    const nav = useNavigate()
    const {isAuthenticated} = useAuth0()
    useEffect(() => {
        const getNews = async () => {
            const {data, error} = await getLatestNews(200)
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
                {isAuthenticated &&
                    <Flex justify={"end"} style={{margin: 20}}>
                        <Button type={"primary"}
                                onClick={() => nav("/news/new")}
                        >Нова новина
                        </Button>
                    </Flex>
                }


                {news.length > 0 &&
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
                                <NewsCard className={[classes.WhiteNewsCard].join(' ')}
                                          news={newsItem}
                                          key={"newsTop-" + newsItem.id}/>
                            )}
                        </div>
                    </Flex>
                }
                <Flex justify={"space-between"} style={{backgroundColor :"#2d313d", padding: "10px 20px",border: "solid black 1px", borderRadius: 20, height: 100}}>
                    <span className={classes.newsTitle} style={{color: "white", fontSize: 40}}>Новини</span>
                    <Flex style={{alignSelf: "end"}}>

                        <Flex gap={5}>

                            <Select placeholder={"Сортування по"}
                                    style={{width: 170}}
                                    options={[
                                        { value: 'popular', label: 'По популярності' },
                                        { value: 'date', label: 'По даті' },
                                    ]}
                            />
                            <Select defaultValue={"asc"}
                                    options={[
                                        { value: 'asc', label: 'По зростанню' },
                                        { value: 'desc', label: 'По спаданню' },
                                    ]}
                            />
                        </Flex>
                    </Flex>
                </Flex>

                {/*<div className={classes.bottomNewsList}>*/}
                {/*    {news.slice(5, news.length).map((n) =>*/}
                {/*        <NewsCard className={[classes.AllNewsPageBottomCard, classes.WhiteNewsCard].join(' ')}*/}
                {/*                  news={n}*/}
                {/*                  key={"newsCa-" + n.id}/>*/}
                {/*    )}*/}
                {/*</div>*/}

                <List
                    pagination={{
                        onChange: (page) => {
                            console.log(page);
                        },
                        pageSize: 6,
                        align : 'center'
                    }}
                    grid={{
                        gutter: 16,
                        column: 4,
                        xs: 1,
                        sm: 2,
                        md: 4,
                        lg: 4,
                        xl: 6,
                        xxl: 3,

                    }}
                    dataSource={news}
                    renderItem={(n) => (
                        <div style={{padding: 10}}>
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