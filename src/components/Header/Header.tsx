import React from 'react';
import './Header.css'
import {Flex, Image} from "antd";
// @ts-ignore
import icon from '../../assets/icon.png'
import {useLocation, useNavigate} from "react-router-dom";

const Header = () => {
    const nav  = useNavigate()
    const { pathname } = useLocation();

    return (
        <Flex justify={"center"} className={"navbar"} style={{display: pathname.includes("chat") ? "none" : "block"}} >
            <Flex gap={20} className={"container"} justify={"space-between"} align={"center"} style={{width: "90vw"}}>
                <Flex onClick={() => nav("/")} className={"nonSelect"}>
                    <span className={"title"}>Милівська сільська територіальна громада</span>
                    <img className={"logo"} src={icon} width={50}/>
                </Flex>
                <Flex wrap={"wrap"} className={"navBtnWrapper nonSelect"}>
                    <span onClick={() => nav("/documents/all")} >Документи</span>
                    <span onClick={() => nav("/news/all")}>Новини</span>
                    <span onClick={() => nav("/forum")} >Форум</span>
                    <span>Управління</span>
                    <span>Установи</span>
                    <span>Контакти</span>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Header;