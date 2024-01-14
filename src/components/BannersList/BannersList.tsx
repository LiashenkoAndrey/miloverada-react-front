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
        <Flex align={"center"} justify={"center"} className={classes.bannersList} vertical style={{backgroundColor: "white"}}>
            <h1 style={{fontSize: "3.0517578125em", marginBottom: 0}}>Важливе</h1>
            <Flex gap={15} justify={"center"} wrap={"wrap"} style={{maxWidth: "80vw"}}>
                {linkBanners.map((linkBanner) =>
                    <Flex gap={5} vertical className={classes.banner}>
                        <span>{linkBanner.text}</span>
                        <a href={linkBanner.url} className={classes.bannerBtn}>Перейти →</a>
                        <span className={classes.bannerTime}>{linkBanner.createdOn}</span>
                    </Flex>
                )}

                {textBanners.map((textBanner) =>
                    <Flex gap={15} vertical className={classes.banner}>
                        <span>{textBanner.description}</span>
                        <span className={classes.bannerBtn} >Читати</span>
                    </Flex>
                )}

            </Flex>
        </Flex>
    );
};

export default BannersList;