import React from 'react';
import {Flex} from "antd";

// @ts-ignore
import arrowLeft from '../../assets/arrowLeft.svg'
import {useNavigate} from "react-router-dom";
const BackBtn = () => {
    const nav = useNavigate()

    return (
        <div style={{padding:"10px 20px"}}>
            <img onClick={() => nav(-1)}  style={{cursor: "pointer"}} src={arrowLeft} height={50}/>
        </div>
    );
};

export default BackBtn;