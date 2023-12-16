import React from 'react';
import './Header.css'
import {Flex, Image} from "antd";
// @ts-ignore
import icon from '../../assets/icon.png'
const Header = () => {
    return (
        <Flex justify={"center"} className={"navbar"}>
            <Flex gap={20} className={"container"} justify={"space-between"} style={{width: "90vw"}}>
                <Flex className={"title"}>
                    <span >Милівська сільська територіальна громада</span>
                </Flex>

                <Flex className={"navBtnWrapper"}>
                    <span>Документи</span>
                    <span>Новини</span>
                    <span>Управління</span>
                    <span>Установи</span>
                    <span>Контакти</span>
                    <span>Про громаду</span>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default Header;