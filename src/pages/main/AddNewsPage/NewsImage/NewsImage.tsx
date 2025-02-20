import React, {FC} from 'react';
import {CloseCircleOutlined} from "@ant-design/icons";
import classes from './NewsImage.module.css'
import {INewsImage} from "../../../../domain/NewsInt";
import {Image} from "antd";

interface NewsImageProps {
    setImagesFiles: React.Dispatch<React.SetStateAction<INewsImage[]>>
    imagesFile : INewsImage[]
    img : INewsImage
}

const NewsImage: FC<NewsImageProps> = ({setImagesFiles, img, imagesFile}) => {

    const onRemove = () => {
        setImagesFiles(imagesFile.filter((e) => e.mongoImageId !== img.mongoImageId))
    }

    return (
        <div  style={{position: "relative"}} className={classes.imgWrapper}>
            <Image className={classes.image} src={img.mongoImageId}  alt="imagePlaceholder" />
            <CloseCircleOutlined onClick={onRemove} className={classes.removeImgIcon} style={{position: "absolute", right : 0, top: 0, fontSize: 25}} />
        </div>
    );
};

export default NewsImage;