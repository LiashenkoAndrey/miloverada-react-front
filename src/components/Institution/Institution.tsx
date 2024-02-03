import React, {FC} from 'react';
import classes from './Institution.module.css'
import {IInstitution} from "../../API/services/InstitutionService";
import {Flex, Image} from "antd";
import {useNavigate} from "react-router-dom";

interface InstitutionProps {
    institution : IInstitution
}

const Institution:FC<InstitutionProps> = ({institution}) => {
    const nav = useNavigate()

    const onClick = () => {
        nav('/institution/' + institution.id)
    }
    return (
        <Flex key={"institution-" + institution.id} gap={10} className={classes.Institution}>
            <div style={{minWidth: 120, minHeight: 120}}>
                <Image style={{cursor: "pointer"}} onClick={onClick} preview={false} src={institution.iconUrl}  width={120}/>
            </div>
            <Flex className={classes.InstitutionInfo}>
                <h2 onClick={onClick} className={classes.title}>{institution.title}</h2>
            </Flex>
        </Flex>
    );
};

export default Institution;