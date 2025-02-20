import React from "react";
import {Button, Flex, Popconfirm} from "antd";
import classes from "./BannersList.module.css";
import {LinkBanner} from "../../../API/services/main/BannersService";

type BannerItemProps = {
  banner: LinkBanner;
  onDelete: (id: number) => void;
  isAdmin: boolean;
};

const BannerItem: React.FC<BannerItemProps> = ({banner, onDelete, isAdmin}) => {
  return (
      <Flex key={banner.id} gap={10} vertical className={classes.banner} justify="space-between">
        <span>{banner.text}</span>
        <a href={banner.url} className={classes.bannerBtn}>Перейти →</a>
        <span className={classes.bannerTime}>{banner.createdOn}</span>
        {isAdmin && (
            <Popconfirm
                title="Delete the banner"
                description="Are you sure you want to delete this banner?"
                onConfirm={() => onDelete(banner.id)}
                okText="Yes"
                cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
        )}
      </Flex>
  );
};

export default BannerItem;