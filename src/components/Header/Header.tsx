import React, {useEffect} from 'react';
import classes from './Header.module.css'
import {Dropdown, Flex, MenuProps, Space} from "antd";
// @ts-ignore
import icon from '../../assets/icon.png'
import {useLocation, useNavigate} from "react-router-dom";
import MobileNav from "./MobileNav";
import {MenuOutlined} from "@ant-design/icons";
import {useAuth0} from "@auth0/auth0-react";

export interface HeaderOption {
    onClick : () => void
    title : string
}

const Header = () => {
    const nav  = useNavigate()
    const { pathname } = useLocation();

    const options : HeaderOption[] = [
        {onClick : () => nav("/documents/all"), title : "Документи"},
        {onClick : () => nav("/newsFeed/all"), title : "Новини"},
        {onClick : () => nav("/forum"), title : "Форум"},
        {onClick : () => nav("/"), title : "Управління"},
        {onClick : () => nav("/institutions"), title : "Установи"},
        {onClick : () => nav("/contacts"), title : "Контакти"},
    ]


    const items: MenuProps['items'] =
        options.map((o) => {
            return {
                label:  <span style={{fontSize: 20}} onClick={o.onClick}>{o.title}</span>,
                key: 'nav-elem-' + o.title,
            }
        })


    return (
        <Flex justify={"center"} className={classes.navbar} style={{display: pathname.includes("chat") || pathname.includes("news/new") ? "none" : "block"}} >
            <Flex className={"IContainer"} justify={"space-between"} align={"center"} >
                <Flex onClick={() => nav("/")} className={"nonSelect"}>
                    <span className={classes.title}>Милівська сільська територіальна громада</span>
                    <img className={classes.logo} src={icon} width={50} alt={"Герб України"}/>

                </Flex>


                <Flex wrap={"wrap"} justify={"center"} className={[classes.navBtnWrapper, "nonSelect"].join(' ')}>
                    {options.map((o) =>
                        <span key={"Head-option-" + o.title} onClick={o.onClick}>{o.title}</span>
                    )}
                </Flex>


                <Flex wrap={"wrap"} justify={"center"} className={[classes.mobileNavBtnWrapper, "nonSelect"].join(' ')}>
                    <Dropdown menu={{items}} trigger={['click']}>
                        <Space>
                            <MenuOutlined className={classes.menu} style={{ fontSize: 30}} />
                        </Space>
                    </Dropdown>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Header;