import React, {FC, useEffect, useState} from 'react';
import {INewsDto} from "../../../../domain/NewsInt";
import {Flex} from "antd";
import classes from '../NewsCard/NewsCard.module.css'
import mainPageClasses from '../../../../pages/main/MainPage/MainPage.module.css'
import NewsCard from "../NewsCard/NewsCard";

export interface NewsListProps {
    newsList : INewsDto[]
}

const NewsList : FC<NewsListProps> = ({newsList,

}) => {

    const [width, setWidth] = useState(window.innerWidth);



    useEffect(() => {
        const handleResize = () => {
            console.log("upd")
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    function getClasses(i : number) {
        console.log(window.innerHeight)
        if ((i === 0 || i === 3) && window.innerWidth > 800) {
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
                    <NewsCard className={((i === 0 || i === 3) && (width > 800))
                        ?
                        [mainPageClasses.wideNewsCard, classes.wideNewsCard].join(' ')

                        :
                        [classes.whiteNewsCard, mainPageClasses.whiteNewsCard].join(' ')
                    }
                              key={"newsList-" + news.id}
                              news={news}
                    />
                )}
            </div>
        </Flex>
    );
};

export default NewsList;
