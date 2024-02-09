import React, {useEffect, useState} from 'react';
import {Flex} from "antd";
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
        <Flex justify={"center"}>
            <Flex vertical className={contactPageClasses.contactsPage}>
                <BackBtn/>

                <Flex align={"center"} justify={"center"} style={{flexGrow : 1, position: "relative"}}>
                    <Flex style={{maxWidth: "80vw", top: "-10vh", position: "relative"}} align={"center"} justify={"center"} vertical={true}>
                        <h1>Контакти</h1>
                        <Flex vertical gap={10}>
                            {contacts.map((contact) =>
                                <Employee contact={contact}/>
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default ContactsPage;