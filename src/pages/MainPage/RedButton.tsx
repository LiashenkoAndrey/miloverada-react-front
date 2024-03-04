import React, {CSSProperties, FC, MouseEventHandler, ReactNode} from 'react';
import {Button} from "antd";

interface IBtn {
    onClick? : MouseEventHandler<HTMLElement>
    style? : CSSProperties
    children : ReactNode
}

const RedButton : FC<IBtn> = ({children, onClick, style}) => {
    return (
        <Button onClick={onClick} type={"primary"}
                className={"redBtn"}
                style={style}
        >{children}</Button>
    );
};

export default RedButton;