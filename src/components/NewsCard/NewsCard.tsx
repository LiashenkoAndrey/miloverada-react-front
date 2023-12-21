import React, {FC} from 'react';
import {INews} from "../../domain/NewsInt";
import {getImageUrl} from "../../API/services/ImageService";
// @ts-ignore
import {useNavigate} from "react-router-dom";

const NewsCard : FC<INews>= ({description, image_id, id, newsType, style}) => {
    const nav = useNavigate()

    return (
        <div onClick={() => nav("/news/" + id)} key={image_id} className={"newsCard"} style={style}>
            <img  src={getImageUrl(image_id)} alt="news"/>
            <div className={"newsCardContent"}>
                <span>{newsType}</span>
                <span className={"newsCardDescription"}>{description}</span>
            </div>
        </div>
    );
};

export default NewsCard;