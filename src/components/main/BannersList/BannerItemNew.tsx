import React, {FC, useContext} from 'react';
import {Button, Flex, Image} from "antd";
import classes from "./BannersList.module.css";
import {checkPermission} from "../../../API/Util";
import {DeleteOutlined} from "@ant-design/icons";
import {LinkBanner} from "../../../API/services/main/BannersService";
import {AuthContext} from "../../../context/AuthContext";

interface BannerItemNewProps {
  linkBanner: LinkBanner
  confirmDeleteBanner : (id : number) => void
}

const BannerItemNew: FC<BannerItemNewProps> = ({linkBanner, confirmDeleteBanner}) => {
  const {jwt} = useContext(AuthContext)

    return (
        <Flex key={"linkBanner-" + linkBanner.id}
              gap={10}
              vertical
              wrap={"wrap"}
              className={classes.banner}
              justify={"space-between"}
        >
          <a target="_blank" style={{textDecoration: "none", color: "black", userSelect: "auto"}} href={linkBanner.url}>
            <span className={classes.bannerText}>{linkBanner.text}</span>
          </a>
          {linkBanner.imageUrl !== null &&
              <img className={classes.bannerImg} src={linkBanner.imageUrl}/>
          }
          <a target="_blank" href={linkBanner.url} className={classes.bannerBtn}>Перейти →</a>
          <span className={classes.bannerTime}>{linkBanner.createdOn}</span>
          {(jwt && checkPermission(jwt, "admin")) &&
              <Button icon={<DeleteOutlined/>} onClick={() => confirmDeleteBanner(linkBanner.id)}/>
          }
        </Flex>
    );
};

export default BannerItemNew;