import React, {useEffect, useState} from 'react';
import {Button, Flex} from "antd";
import {
    getAllLinkBanners,
    LinkBanner,
    TextBanner
} from "../../../API/services/main/BannersService";
import classes from './BannersList.module.css'

const BannersList = () => {

    const [linkBanners, setLinkBanners] = useState<LinkBanner[]>([])
    const [textBanners] = useState<TextBanner[]>([])

    const getLinkBanners = async () => {
        const {data, error} = await getAllLinkBanners()
        if (data) {
            setLinkBanners(data.content)
        }
    }

    useEffect(() => {
        getLinkBanners()
    }, []);

    return (
        <Flex align={"center"} justify={"center"} className={classes.bannersListWrapper} vertical >
            <Button>Додати банер</Button>
            <Flex className={classes.bannersList} >
                {linkBanners.map((linkBanner) =>
                    <Flex key={"linkBanner-" + linkBanner.id}
                          gap={10}
                          vertical
                          wrap={"wrap"}
                          className={classes.banner}
                          justify={"space-between"}
                    >
                        <span className={classes.bannerText}>{linkBanner.text}</span>
                        <a  target="_blank" href={linkBanner.url} className={classes.bannerBtn}>Перейти →</a>
                        <span className={classes.bannerTime}>{linkBanner.createdOn}</span>
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
};

export default BannersList;