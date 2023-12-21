import React, {FC, MouseEventHandler} from 'react';
import {Button} from "antd";

interface IBtn {
    text : string
    onClick? : MouseEventHandler<HTMLElement>
}

const RedButton : FC<IBtn> = ({text, onClick}) => {
    return (
        <Button onClick={onClick} type={"primary"} style={{borderRadius: 0, color: "white", fontSize: 28, height: "fit-content", padding: "3px 4em", fontFamily: "Open Sans"}}>{text}</Button>
    );
};

export default RedButton;