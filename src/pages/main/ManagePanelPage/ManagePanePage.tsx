import React, {FC} from 'react';
import type {MenuProps} from 'antd';
import {ConfigProvider, Flex, Menu, Splitter} from 'antd';
import UserIcon from "../../../components/shared/Header/UserIcon";
import classes from './ManagePanePage.module.css'
import locale from "antd/es/locale/uk_UA";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import BannersList from "../../../components/main/BannersList/BannersList";
import BannerItem from "../../../components/main/BannersList/BannerItem";

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: 'main',
    label: 'Головна сторінка',
    type: 'group',
    children: [
      {key: 'banners', label: 'Банери'},
      {key: 'news', label: 'Новини'},
    ],
  },
  {
    type: 'divider',
  },
];

interface ManagePanePageProps {
}

const ManagePanePage: FC<ManagePanePageProps> = (props) => {
  const nav = useNavigate()
  const {section} = useParams();
  const location = useLocation();
  const onClick: MenuProps['onClick'] = (e) => {
    const path = e.key;
    nav("/manage-panel/"  + path)
    console.log('click ', e);
  };

  return (
      <ConfigProvider locale={locale} theme={{
        token: {
          colorPrimary: '#060998',
        },
      }}>

        <Flex vertical style={{height: "100vh", backgroundColor: "white"}}>
          <Flex justify={"space-between"} align={"center"} style={{
            height: 70,
            border: "solid 2px black",
            paddingRight: 10,
            position: "relative"
          }}>
            <div className={classes.radialGradient}
                 style={{position: "absolute", width: 600, height: "100%"}}>

            </div>

            <h1 style={{zIndex: 1}} className={classes.title}>Панель керування</h1>

            <UserIcon/>
          </Flex>

          <Splitter style={{boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>

            <Splitter.Panel defaultSize="15%" min="10%" max="30%">
              <Menu
                  onClick={onClick}
                  defaultSelectedKeys={[section ? section : ""]}
                  defaultOpenKeys={['sub1']}
                  mode="inline"
                  items={items}
              />
            </Splitter.Panel>

            <Splitter.Panel>
              {location.pathname === "/manage-panel/banners" &&
                  <BannersList
                      renderBanner={(banner, confirmDeleteBanner) =>
                          <BannerItem linkBanner={banner}
                                      confirmDeleteBanner={confirmDeleteBanner}
                      />}
                  />
              }
              {location.pathname === "/manage-panel/news" && <h1>News Content</h1>}
            </Splitter.Panel>
          </Splitter>
        </Flex>
      </ConfigProvider>
  );
};

export default ManagePanePage;