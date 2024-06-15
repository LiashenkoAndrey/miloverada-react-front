import React, {useEffect, useState} from 'react';
import classes from './MainPage.module.css'
import {Flex} from "antd";
import {getAllNews} from "../../API/services/NewsService";
import NewsList from "../../components/NewsList/NewsList";
import RedButton from "./RedButton";
import NewsListLoader from "../../components/NewsList/NewsListLoader";
import {useNavigate} from "react-router-dom";
import BannersList from "../../components/BannersList/BannersList";
import MainPageImageParallax from "./MainPageImageParallax";
import ParallaxImage from "./ParallaxImage";
// @ts-ignore
import './AppTest.css';
// @ts-ignore
import bg1 from '../../assets/backgrounds/bg1.png'
// @ts-ignore
import bg2 from '../../assets/backgrounds/bg2.png'
// @ts-ignore
import bg3 from '../../assets/backgrounds/bg3.png'


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

        // getNews()
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
                <div className={"App"} style={{gap : `${Math.abs(position.x / 2)}px`}}>
                    <ParallaxImage wrapperClass={"parallaxImageWrapper_1"}
                                   className={"parallax_image_1"}
                                   wrapperStyle={{zIndex : 1, overflow: "initial"}}
                                   style={{clipPath : "polygon(5% 5%, 87.45% 4.46%, 51.01% 84.29%, 5% 95%)"}}
                                   imgUrl={bg1}
                    />
                    <ParallaxImage className={'parallax_image_2'}
                                   wrapperClass={"parallaxImageWrapper_2"}
                                   wrapperStyle={{zIndex : 1}} style={{}}
                                   imgUrl={bg2}
                    />
                    <ParallaxImage className={'parallax_image_3'}
                                   wrapperClass={"parallaxImageWrapper_3"}
                                   wrapperStyle={{overflow : "initial"}}
                                   style={{}}
                                   imgUrl={bg3}
                    />
                </div>
            </div>
            {/*<MainPageImageParallax/>*/}

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
