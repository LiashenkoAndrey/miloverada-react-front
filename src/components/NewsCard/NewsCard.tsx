import React, {FC} from 'react';
import {INewsDto} from "../../domain/NewsInt";
import {getImageUrl} from "../../API/services/ImageService";
// @ts-ignore
import {useNavigate} from "react-router-dom";
import {EyeOutlined} from "@ant-design/icons";
import classes from './NewsCard.module.css'
import {Flex} from "antd";

interface NewsCardProps {
    news : INewsDto,
    style? : React.CSSProperties | undefined
    className? : string
}

const NewsCard : FC<NewsCardProps>= ({news, style, className}) => {
    const nav = useNavigate()
    const newsImage = news.images && news.images[0]

    return (
        <div onClick={() => nav("/newsList/" + news.id)} key={newsImage?.mongoImageId} className={"newsCard " + (className ? className : "")} style={style}>
            <img src={getImageUrl(newsImage?.mongoImageId)} className={"imageWithPlaceholder"} alt={newsImage?.fileName}/>
            <div className={"newsCardContent"}>
                <span>{news.newsType?.title}</span>
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