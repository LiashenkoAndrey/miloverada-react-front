import React, {useEffect, useState} from 'react';
import classes from './AllInstitutionsPage.module.css'
import {Flex} from "antd";
import {getAllInstitutions, IInstitution} from "../../API/services/InstitutionService";
import Institution from "../../components/Institution/Institution";
import {useNavigate} from "react-router-dom";

const AllInstitutionsPage = () => {
    const [institutions, setInstitutions] = useState<IInstitution[]>([])

    useEffect(() => {
        const getAll = async () => {
            const {data} = await getAllInstitutions()
            if (data) {
                setInstitutions(data)
            }
        }
        getAll()
    }, []);

    return (
        <Flex justify={"center"}>
            <Flex vertical className={classes.AllInstitutionsPage}>

                <h1>Установи</h1>

                <Flex vertical wrap={"wrap"} gap={10}>
                    {institutions.map((institution) =>
                        <Institution institution={institution}/>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default AllInstitutionsPage;