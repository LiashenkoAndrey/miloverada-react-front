import React, {FC} from 'react';
import {INews, INewsDto} from "../../domain/NewsInt";
import {getImageUrl} from "../../API/services/ImageService";
// @ts-ignore
import {useNavigate} from "react-router-dom";
import {CommentOutlined, EyeOutlined, MessageOutlined} from "@ant-design/icons";
import classes from './NewsCard.module.css'
import {Flex, Skeleton} from "antd";

interface NewsCardProps {
    news: INewsDto | INews,
    style?: React.CSSProperties | undefined
    className?: string
}

const NewsCard: FC<NewsCardProps> = ({news, style, className}) => {
    const nav = useNavigate()
    const newsImage = news.image_id ? news.image_id : news.images && news.images[0]






    return (
        <Flex vertical
              onClick={() => nav("/newsFeed/" + news.id)}
              key={typeof newsImage === "string" ? newsImage : newsImage?.mongoImageId}
              className={[classes.newsCard, (className ? className : "")].join(' ')}
              style={style}
        >
            <img src={getImageUrl(typeof newsImage === "string" ? newsImage : newsImage?.mongoImageId)}
                 className={"imageWithPlaceholder"}
                 style={{minHeight: 250}}
                 alt={typeof newsImage === "string" ? newsImage : newsImage?.mongoImageId}
            />
            <div className={classes.newsCardContent}>
                <span className={classes.newsType}>{news.newsType?.title}</span>
                <p className={classes.newsCardDescriptionWrapper}  style={{margin: news.description.length > 60 ? "0px 10px 22px 10px" : "0px 10px 10px 10px", display: "block"}}>
                    <span  className={classes.newsCardDescription}>

                        {news.description
                            ?
                            <span  >{news.description}</span>
                            :
                            <Skeleton/>
                        }

                        <Flex gap={5}
                              align={"center"}
                              justify={"center"}
                              className={classes.newsViews}
                        >
                            {news.views > 0 &&
                                <>
                                    <EyeOutlined className={classes.eye + " eye"}
                                                 style={{fontSize: 16}}
                                    />
                                    <span className={classes.eye}
                                          style={{fontSize: 16, height: "fit-content"}}
                                    >
                                {news.views}
                            </span>
                                </>
                            }

                            {news.commentsAmount > 0 &&
                                <>
                                    <MessageOutlined className={classes.eye + " eye"}
                                                 style={{fontSize: 16}}
                                    />
                                    <span className={classes.eye}
                                          style={{fontSize: 16, height: "fit-content"}}
                                    >
                                {news.commentsAmount}
                            </span>
                                </>
                            }
                        </Flex>
                    </span>
                </p>
            </div>

        </Flex>
    );
};

export default NewsCard;
