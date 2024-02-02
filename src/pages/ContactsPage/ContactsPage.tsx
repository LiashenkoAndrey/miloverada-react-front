import React, {useEffect, useState} from 'react';
import {Flex, Image, Table} from "antd";
import contactPageClasses from './ContactsPage.module.css'

// @ts-ignore
import arrowLeft from '../../assets/arrowLeft.svg'
import {useNavigate} from "react-router-dom";
import {IContact, getAllContacts} from "../../API/services/ContactsService";
import Contact from "../../components/Contact/Contact";
const ContactsPage = () => {
    const nav = useNavigate()

    const [contacts, setContacts] = useState<IContact[]>([])

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
                <Flex style={{padding:"10px 20px"}}>
                    <img onClick={() => nav(-1)}  style={{cursor: "pointer"}} src={arrowLeft} height={50}/>
                </Flex>

                <Flex align={"center"} justify={"center"} style={{flexGrow : 1, position: "relative"}}>
                    <Flex style={{maxWidth: "80vw", top: "-10vh", position: "relative"}} align={"center"} justify={"center"} vertical={true}>
                        <h1>Контакти</h1>
                        <Flex vertical gap={10}>
                            {contacts.map((contact) =>
                                <Contact contact={contact}/>
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default ContactsPage;