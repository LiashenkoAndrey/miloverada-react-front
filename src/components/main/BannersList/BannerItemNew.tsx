import React, {FC, useContext} from 'react';
import {Button, Flex, Image} from "antd";
import classes from "./BannersList.module.css";
import {checkPermission} from "../../../API/Util";
import {DeleteOutlined} from "@ant-design/icons";
import {LinkBanner} from "../../../API/services/main/BannersService";
import {AuthContext} from "../../../context/AuthContext";

interface BannerItemNewProps {
  banner: LinkBanner
  confirmDeleteBanner : (id : number) => void
}

const BannerItemNew: FC<BannerItemNewProps> = ({banner, confirmDeleteBanner}) => {
  const {jwt} = useContext(AuthContext)

    return (
        <Flex key={"linkBanner-" + banner.id}
              gap={10}
              vertical
              wrap={"wrap"}
              className={classes.banner}
              justify={"space-between"}
        >
          <a target="_blank" style={{textDecoration: "none", color: "black", userSelect: "auto"}} href={banner.url}>
            <span className={classes.bannerText}>{banner.text}</span>
          </a>
          {banner.imageUrl !== null &&
              <img className={classes.bannerImg} src={banner.imageUrl}/>
          }
          <span className={classes.bannerTime}>{banner.createdOn}</span>
          {(jwt && checkPermission(jwt, "admin")) &&
              <Button icon={<DeleteOutlined/>} onClick={() => confirmDeleteBanner(banner.id)}/>
          }
        </Flex>
    );
};

export default BannerItemNew;