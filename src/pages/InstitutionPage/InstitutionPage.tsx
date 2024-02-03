import React, {useEffect, useState} from 'react';
import classes from './InstitutionPage.module.css'
import {Collapse, CollapseProps, Flex, Skeleton} from "antd";
import {useParams} from "react-router-dom";
import {getInstitutionById, IInstitution} from "../../API/services/InstitutionService";
import Employee from "../../components/Employee/Employee";
import Document from "../../components/Document/Document";


const InstitutionPage = () => {

    const {id} = useParams()
    const [institution, setInstitution] = useState<IInstitution>()
    useEffect(() => {
        const getInstitution = async (id : number) => {
            const {data} = await getInstitutionById(id);
            if (data) setInstitution(data)
        }

        if (id) getInstitution(Number(id))
    }, []);

    function getItems() : CollapseProps['items']  {
        const items: CollapseProps['items'] = institution?.document_group.map((sub) => {
            return {
                key: "sub" + sub.id,
                label: <h2 style={{margin: 0, fontWeight : "initial", fontSize: 16}}>{sub.name}</h2>,
                children: <Flex gap={10} vertical>
                            {sub.documents.map((doc) =>
                                <Document document={doc} onClick={(fileName) => console.log(fileName)}/>
                            )}
                        </Flex>
            }
        })
        return items;
    }
    return (
        <Flex justify={"center"}>
            <Flex vertical className={classes.page}>
                {institution
                    ?
                    <h1>{institution.title.toUpperCase()}</h1>
                    :
                    <Skeleton />
                }

                <Flex vertical gap={10}>
                    {institution?.employee_list.map((contact) =>
                        <Employee contact={contact}/>
                    )}
                </Flex>

                <Flex vertical>
                    <span style={{fontWeight: "bold", fontSize: 18, margin: "15px 0"}}>Документи</span>
                    <Collapse defaultActiveKey={['1']} items={getItems()}/>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default InstitutionPage;