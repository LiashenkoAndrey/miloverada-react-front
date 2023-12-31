import React, {FC} from 'react';
import {INews} from "../../domain/NewsInt";
import {Flex} from "antd";
import './NewsList.css'
import NewsCard from "../NewsCard/NewsCard";
export interface NewsListProps {
    newsList? : Array<INews>
    wide? : boolean
    name? : string
}

const NewsList : FC<NewsListProps> = ({newsList, wide, name}) => {


    return (
        <Flex gap={35} wrap={"wrap"} justify={"center"} className={"newsList " + (wide ? " wideNewsCard " : "") + name }>
            {newsList?.map((newsOne =>
                    <NewsCard description={newsOne.description}
                              image_id={newsOne.image_id}
                              id={newsOne.id}
                              newsType={newsOne.newsType}
                    />
            ))}
        </Flex>
    );
};

export default NewsList;