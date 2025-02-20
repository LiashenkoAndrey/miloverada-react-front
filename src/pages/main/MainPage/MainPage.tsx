import React, {useEffect, useState} from 'react';
import classes from './MainPage.module.css'
import {Flex} from "antd";
import {getAllNews} from "../../../API/services/main/NewsService";
import NewsList from "../../../components/main/news/NewsList/NewsList";
import RedButton from "./RedButton";
import NewsListLoader from "../../../components/main/news/NewsList/NewsListLoader";
import {useNavigate} from "react-router-dom";

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

    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: { clientX: any; clientY: any; }) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const offsetX = (clientX - centerX) / 30; // Зміна швидкості руху
            const offsetY = (clientY - centerY) / 30;
            setPosition({ x: offsetX, y: offsetY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div style={{position: "relative", height: " 100%"}}>
            <div style={{position: "relative"}}>
                <div className={"App"}

                     style={{backgroundImage: "url(https://faculty.sites.iastate.edu/lab-example/files/inline-images/fog-4597348_1920.jpg)",
                         backgroundRepeat: "no-repeat",
                         backgroundPosition: "center",
                         backgroundSize: "cover"}}
                >

                </div>
            </div>

            <Flex vertical={true} className={classes.content}>
                <Flex vertical={true}
                      align={"center"}
                      className={classes.greetingWrapper}
                >
                    <p className={classes.greetingTitle}>Вітаємо!</p>

                    <h1 className={classes.greetingText}>
                        Вітаємо на офіційному сайті Милівської сільської територіальної громади,
                        тут ви можете дізнаться останні новини, завантижити документи,
                        поспілкуватся на форумі та багато іншого...
                    </h1>

                    <RedButton onClick={() => nav("/about")}
                               style={{marginTop: 20}}
                    >
                        <span>Про громаду</span>
                    </RedButton>
                </Flex>


                <Flex justify={"center"}
                      className={classes.NewsAndBanners}
                >
                    <Flex vertical={true}
                          align={"center"}
                          className={classes.NewsListWrapperWithTitle}
                    >
                        <h1 style={{
                            fontSize: "3.0517578125em",
                            marginBottom: 0,
                            userSelect: "none",
                            textAlign: "center"
                        }}>Новини громади</h1>
                        <p style={{
                            fontSize: 28,
                            fontWeight: 400,
                            padding: 10,
                            userSelect: "none",
                            textAlign: "center"
                        }}>
                            Останні події громади, інновації
                        </p>
                        {news === undefined
                            ?
                            <NewsListLoader/>
                            :
                            <NewsList newsList={news}/>

                        }

                        <RedButton onClick={() => nav("/newsFeed/all")}>
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
