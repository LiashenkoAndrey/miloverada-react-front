import React, {FC} from 'react';
import {INewsDto} from "../../domain/NewsInt";
import {Flex} from "antd";
import './NewsList.css'
import NewsCard from "../NewsCard/NewsCard";

export interface NewsListProps {
    newsList? : INewsDto[]
    wide? : boolean
    name? : string
}

const NewsList : FC<NewsListProps> = ({newsList, wide, name}) => {


    return (
        <Flex gap={35} wrap={"wrap"} justify={"center"} className={"newsList " + name }>
            {newsList?.map((newsOne, index) =>
                    <NewsCard className={name ? "whiteNewsCard " : (index === 0 || index === newsList?.length -1 ? "wideNewsCard" : "n")} key={"newsList-" + newsOne.id} news={newsOne}/>
            )}
        </Flex>
    );
};

export default NewsList;