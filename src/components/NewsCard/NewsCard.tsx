import React, {FC} from 'react';
import {INews} from "../../domain/NewsInt";
import {getImageUrl} from "../../API/services/ImageService";
// @ts-ignore
import {useNavigate} from "react-router-dom";
import {EyeOutlined} from "@ant-design/icons";
import classes from './NewsCard.module.css'
import {Flex} from "antd";

interface NewsCardProps {
    news : INews,
    style? : React.CSSProperties | undefined
}

const NewsCard : FC<NewsCardProps>= ({news, style}) => {
    const nav = useNavigate()
    return (
        <div onClick={() => nav("/news/" + news.id)} key={news.image_id} className={"newsCard"} style={style}>
            <img  src={getImageUrl(news.image_id)} alt="news"/>
            <div className={"newsCardContent"}>
                <span>{news.newsType}</span>
                <span className={"newsCardDescription"}>{news.description}</span>
            </div>
            <Flex gap={5} align={"center"} justify={"center"} className={classes.newsViews + " views"}>
                <EyeOutlined className={classes.eye + " eye"} style={{fontSize: 16}} />
                <span className={classes.eye + " eye"} style={{fontSize: 16, height: "fit-content"}}>{news.views}</span>
            </Flex>
        </div>
    );
};

export default NewsCard;