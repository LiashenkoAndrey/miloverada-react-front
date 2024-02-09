import React, {FC} from 'react';
import {CloseCircleOutlined} from "@ant-design/icons";
import classes from './NewsImage.module.css'

interface NewsImageProps {
    setImagesFiles: React.Dispatch<React.SetStateAction<string[]>>
    imagesFile : string[]
    img : string
}

const NewsImage: FC<NewsImageProps> = ({setImagesFiles, img, imagesFile}) => {

    const onRemove = () => {
        setImagesFiles(imagesFile.filter((e) => e !== img))
    }

    return (
        <div  style={{position: "relative"}} className={classes.imgWrapper}>
            <img className={classes.image} src={img} alt="imagePlaceholder" />
            <CloseCircleOutlined onClick={onRemove} className={classes.removeImgIcon} style={{position: "absolute", right : 0, top: 0, fontSize: 25}} />
        </div>
    );
};

export default NewsImage;