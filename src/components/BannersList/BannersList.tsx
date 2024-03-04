import React, {useEffect, useState} from 'react';
import {Button, Flex} from "antd";
import {getAllLinkBanners, getAllTextBanners, LinkBanner, TextBanner} from "../../API/services/BannersService";
import classes from './BannersList.module.css'
import {toDate, toTime} from "../../API/Util";
const BannersList = () => {

    const [linkBanners, setLinkBanners] = useState<LinkBanner[]>([])
    const [textBanners, setTextBanners] = useState<TextBanner[]>([])

    const getLinkBanners = async () => {
        const {data, error} = await getAllLinkBanners()
        if (data) {
            setLinkBanners(data)
        } else throw error
    }

    const getTextBanners = async () => {
        const {data, error} = await getAllTextBanners()
        if (data) {
            setTextBanners(data)
        } else throw error
    }

    useEffect(() => {
        getLinkBanners()
        getTextBanners()
    }, []);

    return (
        <Flex align={"center"} justify={"center"} className={classes.bannersListWrapper} vertical >
            <div className={classes.bannersList} >
                {linkBanners.map((linkBanner) =>
                    <Flex key={"linkBanner-" + linkBanner.id}
                          gap={10}
                          vertical
                          className={classes.banner}
                          justify={"space-between"}
                    >
                        <span>{linkBanner.text}</span>
                        <a href={linkBanner.url} className={classes.bannerBtn}>Перейти →</a>
                        <span className={classes.bannerTime}>{linkBanner.createdOn}</span>
                    </Flex>
                )}

                {textBanners.map((textBanner) =>
                    <Flex  key={"textBanner-" + textBanner.id}
                           gap={10}
                           vertical
                           className={classes.banner}
                           justify={"space-between"}
                    >
                        <span>{textBanner.description}</span>
                        <span className={classes.bannerBtn} >Читати</span>
                        <span className={classes.bannerTime}>{textBanner.createdOn}</span>
                    </Flex>
                )}

            </div>
        </Flex>
    );
};

export default BannersList;