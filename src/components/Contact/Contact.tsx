import React, {FC, useEffect, useState} from 'react';
import classes from "./Contact.module.css"
import {Button, Flex, Typography} from "antd";
import {IContact} from "../../API/services/ContactsService";
import {CopyOutlined, MailOutlined, PhoneOutlined} from "@ant-design/icons";
const { Text, Paragraph } = Typography;
interface ContactProps {
    contact : IContact
}
const Contact: FC<ContactProps> = ({contact}) => {
    console.log(contact)
    const [writeActive, setWriteActive] = useState<boolean>(false)
    useEffect(() => {
        if (contact.id === 8) setWriteActive(true)
    }, []);
    return (
        <Flex key={"contact-" + contact.id} className={classes.contact} gap={20} wrap={"wrap"}>
            <Flex gap={5} justify={"space-between"} className={classes.contactNameWrapper}>
                <Flex className={classes.contactName} gap={5}>
                    <span>{contact.first_name}</span>
                    <span>{contact.last_name}</span>
                </Flex>
                {writeActive &&
                    <Button>Написати</Button>

                }
            </Flex>
            <Flex className={classes.contactInfo} vertical>
                <Paragraph   className={classes.mail} copyable={{tooltips : ["Копіювати пошту", "Скопійовано!"], icon: <CopyOutlined style={{color:"rgba(19,78,196,0.4)"}} />}}><MailOutlined /> {contact.email}</Paragraph>
                <Text className={classes.phone} copyable={{tooltips : ["Копіювати номер телефону", "Скопійовано!"], icon: <CopyOutlined style={{color:"rgba(19,78,196,0.4)"}} />}}><PhoneOutlined /> {contact.phone_number}</Text>
            </Flex>
        </Flex>
    );
};

export default Contact;