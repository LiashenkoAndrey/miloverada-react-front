import React from 'react';
import './Header.css'
import {Flex} from "antd";
import {useNavigate} from "react-router-dom";

const Header = () => {
    const nav  = useNavigate()

    return (
        <Flex justify={"center"} className={"navbar"}>
            <Flex gap={20} className={"container"} justify={"space-between"} align={"center"} style={{width: "90vw"}}>
                <Flex onClick={() => nav("/")} className={"title nonSelect"}>
                    <span >Милівська сільська територіальна громада</span>
                </Flex>

                <Flex className={"navBtnWrapper nonSelect"}>
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