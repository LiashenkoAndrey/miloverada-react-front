import React, {useEffect, useState} from 'react';
import {Flex, Skeleton} from "antd";
import contactPageClasses from './ContactsPage.module.css'
import {getAllContacts, IEmployee} from "../../API/services/ContactsService";
import Employee from "../../components/Employee/Employee";
import BackBtn from "../../components/BackBtn/BackBtn";

const ContactsPage = () => {


    const [contacts, setContacts] = useState<IEmployee[]>([])

    useEffect(() => {
        const getContacts = async () => {
            const {data} = await getAllContacts()
            if (data) {
                setContacts(data)
            }
        }

        getContacts()
    }, []);

    return (
        <Flex className={contactPageClasses.wrapper}>
            <Flex vertical className={contactPageClasses.contactsPage}>
                <BackBtn/>
                <h1>Контакти</h1>
                <Flex vertical gap={10}>
                    {contacts.length > 0
                        ?
                        contacts.map((contact) =>
                            <Employee contact={contact}/>
                        )
                        :
                        <>
                            <Skeleton/>
                            <Skeleton/>
                            <Skeleton/>
                            <Skeleton/>
                        </>}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default ContactsPage;