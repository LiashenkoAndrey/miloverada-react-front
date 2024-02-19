import React, {CSSProperties, FC} from 'react';

// @ts-ignore
import arrowLeft from '../../assets/arrowLeft.svg'
import {useNavigate} from "react-router-dom";

interface BackBtnProps {
    style? : CSSProperties
}

const BackBtn:FC<BackBtnProps> = ({style}) => {
    const nav = useNavigate()

    return (
        <div style={style} >
            <img className={"backBtn"} onClick={() => nav(-1)}  style={{cursor: "pointer"}} src={arrowLeft} height={50} width={50}/>
        </div>

    );
};

export default BackBtn;