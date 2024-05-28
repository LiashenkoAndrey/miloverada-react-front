import React, {useEffect, useState} from 'react';
import classes from './MainPage.module.css'
import {Flex} from "antd";
import {getAllNews} from "../../API/services/NewsService";
import NewsList from "../../components/NewsList/NewsList";
import RedButton from "./RedButton";
import NewsListLoader from "../../components/NewsList/NewsListLoader";
import {useNavigate} from "react-router-dom";
import BannersList from "../../components/BannersList/BannersList";


const MainPage = () => {

    const [news, setNews] = useState(undefined);
    const nav = useNavigate()

    useEffect(() => {
        const getNews = async () => {
            const {data, error} = await getAllNews();
            if (data) {
                setNews(data)
            } else throw error;
        }

        getNews()
    }, []);

    return (
        <div style={{position:"relative", height:" 100%"}}>
            <div className={classes.mainImg}></div>
            <Flex vertical={true} className={classes.content}>
                <Flex vertical={true}
                      align={"center"}
                      className={classes.greetingWrapper}
                >
                    <p className={classes.greetingTitle} >Вітаємо!</p>

                    <h1 className={classes.greetingText}>
                        Вітаємо на офіційному сайті Милівської сільської територіальної громади,
                        тут ви можете дізнаться останні новини, завантижити документи,
                        поспілкуватся на форумі та багато іншого...
                    </h1>

                    <RedButton onClick={() => nav("/about")}
                               style={{marginTop: 20}}
                    >
                        <span >Про громаду</span>
                    </RedButton>
                </Flex>


                <Flex justify={"center"}
                      className={classes.NewsAndBanners}
                >
                        <Flex vertical={true}
                              align={"center"}
                              className={classes.NewsListWrapperWithTitle}
                        >
                            <h1 style={{fontSize: "3.0517578125em", marginBottom: 0, userSelect: "none", textAlign : "center"}}>Новини громади</h1>
                            <p style={{fontSize: 28, fontWeight: 400, padding: 10, userSelect: "none",  textAlign : "center"}}>
                                Останні події громади, інновації
                            </p>
                            {news === undefined
                                ?
                                <NewsListLoader/>
                                :
                                <NewsList newsList={news}/>

                            }

                            <RedButton onClick={() => nav("/newsFeed/all")} >
                                Більше новин громади
                            </RedButton>
                        </Flex>

                        {/*<BannersList/>*/}
                </Flex>
            </Flex>
        </div>
    );
};

export default MainPage;
