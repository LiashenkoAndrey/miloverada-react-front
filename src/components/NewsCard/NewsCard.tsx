import React, {FC} from 'react';
import {INewsDto} from "../../domain/NewsInt";
import {getImageUrl} from "../../API/services/ImageService";
// @ts-ignore
import {useNavigate} from "react-router-dom";
import {EyeOutlined} from "@ant-design/icons";
import classes from './NewsCard.module.css'
import {Flex} from "antd";

interface NewsCardProps {
    news: INewsDto,
    style?: React.CSSProperties | undefined
    className?: string
}

const NewsCard: FC<NewsCardProps> = ({news, style, className}) => {
    const nav = useNavigate()
    const newsImage = news.images && news.images[0]


    return (
        <Flex vertical
              onClick={() => nav("/newsFeed/" + news.id)}
              key={newsImage?.mongoImageId}
              className={[classes.newsCard, (className ? className : "")].join(' ')}
              style={style}
        >
            <img src={getImageUrl(newsImage?.mongoImageId)}
                 className={"imageWithPlaceholder"}
                 alt={newsImage?.fileName}
            />
            <div className={classes.newsCardContent}>
                <span className={classes.newsType}>{news.newsType?.title}</span>
                <p style={{margin: "5px 10px 10px 10px", display: "block"}}>
                    <span className={classes.newsCardDescription}>{news.description}

                        <Flex gap={5}
                              align={"center"}
                              justify={"center"}
                              className={classes.newsViews}
                        >
                            <EyeOutlined className={classes.eye + " eye"}
                                         style={{fontSize: 16}}
                            />
                            <span className={classes.eye}
                                  style={{fontSize: 16, height: "fit-content"}}
                            >
                                {news.views}
                            </span>
                        </Flex>
                    </span>
                </p>
            </div>

        </Flex>
    );
};

export default NewsCard;