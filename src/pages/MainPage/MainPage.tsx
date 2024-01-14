import React, {useEffect, useState} from 'react';
import './MainPage.css'
import {Button, Flex} from "antd";
import {getAllNews, getNewsById} from "../../API/services/NewsService";
import NewsList from "../../components/NewsList/NewsList";
import RedButton from "./RedButton";
import {useFetching} from "../../API/hooks/useFetching";
import NewsListLoader from "../../components/NewsList/NewsListLoader";
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

    return (
        <div style={{position:"relative", height:" 100%"}}>
            <div className={"mainImg"}></div>
            <Flex vertical={true} className={"content"}>
                <Flex vertical={true} align={"center"} style={{backgroundColor: "#fff", paddingBottom: 70}}>
                    <h1 style={{fontSize: "3.0517578125em"}}>Вітаємо!</h1>

                    <p style={{maxWidth: "70vw", fontSize: "1.953125em", fontWeight: 300, textAlign: "center"}}>
                        Вітаємо на офіційному сайті Милівської сільської територіальної громади, тут ви можете дізнаться останні новини, завантижити документи, поспілкуватся на форумі та багато іншого...
                    </p>

                    <RedButton text={"Читати далі"}/>
                </Flex>

                <Flex vertical={true} align={"center"} style={{backgroundColor: "#f4f4f4", paddingTop: 30}}>
                    <h1 style={{fontSize: "3.0517578125em", marginBottom: 0}}>Новини громади</h1>
                    <p style={{fontSize: 28, fontWeight: 400}}>
                        Stories about people, research, and innovation across the Farm
                    </p>
                    {news === undefined
                        ?
                        <NewsListLoader/>
                        :
                        <NewsList wide newsList={news}/>
                    }

                    <RedButton onClick={() => nav("/news/all")} text={"Більше новин громади"}/>
                </Flex>

            </Flex>
        </div>
    );
};

export default MainPage;