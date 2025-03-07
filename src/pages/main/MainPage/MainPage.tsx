import React, {useEffect, useState} from 'react';
import classes from './MainPage.module.css'
import NewsList from "../../../components/main/news/NewsList/NewsList";
import {Flex, message} from "antd";
import RedButton from "./RedButton";
import NewsListLoader from "../../../components/main/news/NewsList/NewsListLoader";
import {useNavigate} from "react-router-dom";

import BannersList from "../../../components/main/BannersList/BannersList";
import {getAllNews} from "../../../API/services/main/NewsService";
import BannerItemNew from "../../../components/main/BannersList/BannerItemNew";

// @ts-ignore
import image from '../../../assets/backgrounds/main_page_spring.webp'

const MainPage = () => {
  const [news, setNews] = useState(undefined);
  const nav = useNavigate()

  useEffect(() => {
    const getNews = async () => {
      const {data} = await getAllNews();
      if (data) {
        setNews(data)
      } else message.error("API Server is not responding. Please try again later.", 3);
    }
    getNews()
  }, []);

  return (
      <div style={{position: "relative", height: " 100%"}}>

        <div style={{position: "relative"}}>
          <div className={classes.App}
               style={{
                 backgroundImage: `url(${image})`,
                 backgroundRepeat: "no-repeat",
                 backgroundPosition: "center",
                 backgroundSize: "cover"
               }}
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

          <BannersList
              renderBanner={
                (banner, confirmDeleteBanner) =>
                    <BannerItemNew key={"BannerItemNew" + banner.id}
                                   confirmDeleteBanner={confirmDeleteBanner}
                                   banner={banner}
                    />
              }
          />

          <Flex justify={"center"}
                className={classes.News}
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

              <RedButton style={{marginTop: 30}} onClick={() => nav("/newsFeed/all")}>
                Більше новин громади
              </RedButton>
            </Flex>
          </Flex>
        </Flex>
      </div>
  );
};

export default MainPage;
