import React, {FC, ReactNode, useContext, useEffect, useState} from 'react';
import {Flex, message, Modal} from "antd";
import {
  deleteLinkBanner,
  getAllLinkBanners,
  LinkBanner
} from "../../../API/services/main/BannersService";
import classes from './BannersList.module.css'
import AddBannerModal from "./AddBannerModal";
import {AuthContext} from "../../../context/AuthContext";

interface BannersListProps {
  renderBanner: (banner: LinkBanner, confirmDeleteBanner : (id : number) => void) => ReactNode;
}

const BannersList:FC<BannersListProps> = ({renderBanner}) => {
  const [linkBanners, setLinkBanners] = useState<LinkBanner[]>([])
  const {jwt} = useContext(AuthContext)

  const getLinkBanners = async () => {
    const {data} = await getAllLinkBanners()
    if (data) {
      setLinkBanners(data.content)
    }
  }
  const onAddNewBanner = (banner: any) => {
    setLinkBanners([banner, ...linkBanners])
  }

  const onDeleteBanner = async (id: number)  => {
      if (jwt) {
          const code = await deleteLinkBanner(id, jwt)
          if (code && code.code === 204) {
              message.success("Банер видалено")
             setLinkBanners([...linkBanners.filter((b) => b.id !== id)])
          }
      }
  }

  const confirmDeleteBanner = (id: number) => {
      Modal.confirm({
          centered: true,
          title: 'Підтвердження',
          content: 'Ви впевнені що хочете видалити банер?',
            onOk: () => {
              onDeleteBanner(id)
            },
          footer: (_, { OkBtn, CancelBtn }) => (
              <>
                  <CancelBtn />
                  <OkBtn />
              </>
          ),
      })
  }

  useEffect(() => {
    getLinkBanners()
  }, []);

  return (
      <Flex align={"center"}
            justify={"center"}
            className={classes.bannersListWrapper}
            vertical
      >
        <AddBannerModal onAdd={onAddNewBanner}/>
        <Flex className={classes.bannersList}>
          {linkBanners.map((linkBanner) => renderBanner(linkBanner, confirmDeleteBanner))}
        </Flex>
      </Flex>
  );
};

export default BannersList;