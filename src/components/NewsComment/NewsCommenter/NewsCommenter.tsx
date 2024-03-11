import React, {FC} from 'react';
import {Flex, Image} from "antd";
import classes from "../NewsComment.module.css";
import {isWoman} from "../../../API/Util";
// @ts-ignore
import womanIcon from "../../../assets/user-people-svgrepo-com.svg";
// @ts-ignore
import manIcon from "../../../assets/user-svgrepo-com.svg";
import {AppUser} from "../../../API/services/forum/ForumInterfaces";

interface NewsCommenterProps {
    author : AppUser
}

const NewsCommenter:FC<NewsCommenterProps> = ({author}) => {
    return (
        <Flex className={classes.authorWrapper} gap={5}>
            {author.avatarUrl
                ?
                <Image preview={false}  className={classes.authorImg} style={{userSelect: "none"}}   height={50} src={author.avatarUrl} alt=""/>
                :
                isWoman(author.firstName)
                    ?
                    <img style={{userSelect: "none"}}  height={50} src={womanIcon} alt=""/>
                    :
                    <img style={{userSelect: "none"}}   height={50} src={manIcon} alt=""/>

            }
            <span className={classes.authorName}>{author.firstName} {author.lastName} </span>
        </Flex>
    );
};

export default NewsCommenter;