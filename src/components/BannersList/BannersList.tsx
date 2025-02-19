import React, {useContext, useEffect, useState} from 'react';
import {Flex, message} from "antd";
import {deleteLinkBanner, getAllLinkBanners, LinkBanner} from "../../API/services/BannersService";
import classes from './BannersList.module.css'
import {AuthContext} from "../../context/AuthContext";
import {checkPermission} from "../../API/Util";
import {ADMIN_PERMISSION} from "../../Constants";
import BannerItem from "./BannerItem";

const BannersList = () => {
  const [linkBanners, setLinkBanners] = useState<LinkBanner[]>([])
  const {jwt} = useContext(AuthContext)

  useEffect(() => {
      const fetchBanners = async () => {
          try {
              const banners = await getAllLinkBanners();
              setLinkBanners(banners || []);
          } catch (error) {
              console.error("Failed to fetch banners:", error);
              message.error("API Server is not responding. Please try again later.", 3); // Show message for 3 seconds
          }
      };
      fetchBanners();
  }, []);

  const onDelete = (id: number) => {
    if (!jwt) {
      return
    }
    deleteLinkBanner(id, jwt)
  };

  return (
      <Flex className={classes.bannersListWrapper}>
        <div className={classes.bannersList}>
          {linkBanners.map((linkBanners) => (
              <BannerItem key={linkBanners.id} banner={linkBanners}
                          onDelete={() => onDelete(linkBanners.id)}
                          isAdmin={checkPermission(jwt, ADMIN_PERMISSION)}/>
          ))}
        </div>
      </Flex>
  );
};


export default BannersList;