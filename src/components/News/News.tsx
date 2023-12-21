import React from 'react';
import {INews} from "../../domain/NewsInt";
import {Image} from "antd";
import {getImageUrl} from "../../API/services/ImageService";

const News = ({description, image_id} : INews) => {
    return (
        <div>
            <Image src={getImageUrl(image_id)} alt={"news"}/>
            <p>{description}</p>
        </div>
    );
};

export default News;