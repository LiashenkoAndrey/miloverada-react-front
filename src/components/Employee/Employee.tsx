import React, {FC, useEffect, useState} from 'react';
import classes from "./Employee.module.css"
import {Button, Flex, Typography} from "antd";
import {IEmployee} from "../../API/services/ContactsService";
import {CopyOutlined, MailOutlined, PhoneOutlined} from "@ant-design/icons";
const { Text, Paragraph } = Typography;
interface ContactProps {
    contact : IEmployee
}
const Employee: FC<ContactProps> = ({contact}) => {
    console.log(contact)
    const [writeActive, setWriteActive] = useState<boolean>(false)
    useEffect(() => {
        if (contact.id === 8) setWriteActive(true)
    }, []);
    return (
        <Flex key={"contact-" + contact.id} className={classes.contact} gap={10} wrap={"wrap"}>
            <Flex gap={5} justify={"space-between"} className={classes.contactNameWrapper}>
                <Flex className={classes.contactName} gap={5}>
                    <h2>{contact.first_name} {contact.last_name}</h2>
                </Flex>

            </Flex>
            <Flex className={classes.contactInfo} vertical>
                <Text className={classes.mail} copyable={{tooltips : ["Копіювати пошту", "Скопійовано!"], icon: <CopyOutlined style={{color:"rgba(19,78,196,0.4)"}} />}}><MailOutlined /> {contact.email}</Text>
                <Text className={classes.phone} copyable={{tooltips : ["Копіювати номер телефону", "Скопійовано!"], icon: <CopyOutlined style={{color:"rgba(19,78,196,0.4)"}} />}}><PhoneOutlined /> {contact.phone_number}</Text>
                {contact.position &&
                    <span className={classes.contactInfo} >Посада: <strong>{contact.position}</strong></span>

                }
                {contact.sub_institution &&
                    <span className={classes.contactInfo} > <strong>{contact.sub_institution}</strong></span>
                }

            </Flex>
        </Flex>
    );
};

export default Employee;