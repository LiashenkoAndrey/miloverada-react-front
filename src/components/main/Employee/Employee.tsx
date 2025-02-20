import React, {FC, useContext} from 'react';
import classes from "./Employee.module.css"
import {Dropdown, Flex, MenuProps, notification, Typography} from "antd";
import {CopyOutlined, DeleteOutlined, MailOutlined, PhoneOutlined} from "@ant-design/icons";
import {AuthContext} from "../../../context/AuthContext";
import {useAuth0} from "@auth0/auth0-react";
import {IContact} from "../../../pages/main/ContactsPage/ContactsPage";
import {deleteContactById} from "../../../API/services/main/ContactsService";
import {checkPermission} from "../../../API/Util";

const { Text} = Typography;
interface ContactProps {
    contact : IContact
    removeContactFromArray? (id: number): void
}
const Employee: FC<ContactProps> = ({contact, removeContactFromArray}) => {

    const {jwt} = useContext(AuthContext)
    const {isAuthenticated} = useAuth0()

    const items: MenuProps['items'] = [
        {
            label: 'Видалити',
            icon: <DeleteOutlined/>,
            key: 'delete-' + contact.id,
            danger : true
        },
    ];

    const onSelect: MenuProps['onClick'] = ({key}) => {
        const  arr = key.split("-")
        if (arr[0] === 'delete') {
            deleteContact()
        }
    }

    const deleteContact = async () => {
        if (jwt) {

            const {data, error} = await deleteContactById(contact.id, jwt)
            if (data) {
                notification.success({message: "Контакт успішно видалений!"})
                console.log(data)
                if (removeContactFromArray) {
                    removeContactFromArray(contact.id)
                }
            }

            if (error) {
                notification.error({message: "Виникла помилка :( Спробуйте ще раз!"})
            }
        } else {
            notification.warning({message: "Не авторизована дія!"})
        }
    }




    return (
        <Dropdown menu={{ items : items , onClick : onSelect}}
                  trigger={['contextMenu']}
                  disabled={!checkPermission(jwt, "admin")}

        >
            <Flex key={"contact-" + contact.id}
                  className={classes.contact}
                  gap={10}
                  wrap={"wrap"}
            >
                <Flex gap={5}
                      justify={"space-between"}
                      className={classes.contactNameWrapper}
                >
                    <Flex className={classes.contactName} gap={5}>
                        <h2>{contact.first_name} {contact.last_name}</h2>
                    </Flex>

                </Flex>
                <Flex className={classes.contactInfo} vertical>
                    <Text className={classes.mail}
                          copyable={{
                              tooltips: ["Копіювати пошту", "Скопійовано!"],
                              icon: <CopyOutlined style={{color: "rgba(19,78,196,0.4)"}}/>
                          }}
                    >
                        <MailOutlined/> {contact.email}
                    </Text>
                    <Text className={classes.phone} copyable={{
                        tooltips: ["Копіювати номер телефону", "Скопійовано!"],
                        icon: <CopyOutlined style={{color: "rgba(19,78,196,0.4)"}}/>
                    }}>
                        <PhoneOutlined/> {contact.phone_number}
                    </Text>

                    {contact.position &&
                        <span className={classes.contactInfo}>Посада: <strong>{contact.position}</strong></span>

                    }

                </Flex>
            </Flex>
        </Dropdown>

    );
};

export default Employee;