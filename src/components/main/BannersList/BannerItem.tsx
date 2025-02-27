import React, {useContext} from "react";
import {Button, Flex, Popconfirm} from "antd";
import classes from "./BannersList.module.css";
import {LinkBanner} from "../../../API/services/main/BannersService";
import {AuthContext} from "../../../context/AuthContext";
import {checkPermission} from "../../../API/Util";

type BannerItemProps = {
  linkBanner: LinkBanner;
  confirmDeleteBanner: (id: number) => void;
};

const BannerItem: React.FC<BannerItemProps> = ({linkBanner, confirmDeleteBanner}) => {
  const {jwt} = useContext(AuthContext)
  return (
      <Flex key={linkBanner.id} gap={10} vertical className={classes.banner} justify="space-between">
        <span>{linkBanner.text}</span>
        <a href={linkBanner.url} className={classes.bannerBtn}>Перейти →</a>
        <span className={classes.bannerTime}>{linkBanner.createdOn}</span>
        {(jwt && checkPermission(jwt, "admin")) && (
            <Popconfirm
                title="Delete the banner"
                description="Are you sure you want to delete this banner?"
                onConfirm={() => confirmDeleteBanner(linkBanner.id)}
                okText="Yes"
                cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm>

        )}
        {linkBanner.addedBy &&
          <span>Додав: {linkBanner.addedBy.firstName} {linkBanner.addedBy.lastName}</span>
        }
      </Flex>
  );
};

export default BannerItem;