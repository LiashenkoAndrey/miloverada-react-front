import React, {FC} from 'react';
import {INewsDto} from "../../domain/NewsInt";
import {Flex} from "antd";
import classes from '../NewsCard/NewsCard.module.css'
import mainPageClasses from '../../pages/MainPage/MainPage.module.css'
import NewsCard from "../NewsCard/NewsCard";

export interface NewsListProps {
    newsList : INewsDto[]
}

const NewsList : FC<NewsListProps> = ({newsList,

}) => {
    function getClasses(i : number) {
        if (i === 0 || i === 3) {
            return [mainPageClasses.wideNewsCard, classes.wideNewsCard].join(' ')
        } else {
            return [classes.whiteNewsCard, mainPageClasses.whiteNewsCard].join(' ')
        }
    }


    return (
        <Flex gap={35}
              wrap={"wrap"}
              justify={"center"}
              align={"center"}
              className={mainPageClasses.NewsWrapper}
        >
            <div className={mainPageClasses.gridNewsPageList}>
                {newsList.map((news, i) =>
                    <NewsCard className={getClasses(i)}
                              key={"newsList-" + news.id}
                              news={news}
                    />
                )}
            </div>


            {/*<div className={mainPageClasses.gridNewsPageList}>*/}
            {/*    {newsList.slice(3, 6).map((news, i) =>*/}
            {/*        <NewsCard className={getClasses(i)}*/}
            {/*                  key={"newsList-" + news.id}*/}
            {/*                  news={news}*/}
            {/*        />*/}
            {/*    )}*/}
            {/*</div>*/}
        </Flex>
    );
};

export default NewsList;