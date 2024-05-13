import React, {FC, useContext, useEffect, useState} from 'react';
import {Button, Flex, Form, Input, message, Modal, notification, Skeleton, Typography} from "antd";
import contactPageClasses from './ContactsPage.module.css'
import {getAllContacts, newContact} from "../../API/services/ContactsService";
import Employee from "../../components/Employee/Employee";
import BackBtn from "../../components/BackBtn/BackBtn";
import {AuthContext} from "../../context/AuthContext";
import {useAuth0} from "@auth0/auth0-react";
import {PlusOutlined} from "@ant-design/icons";
import {FormProps} from "react-bootstrap";

const ContactsPage = () => {
    const [contacts, setContacts] = useState<IContact[]>([])
    const {jwt} = useContext(AuthContext)
    const {isAuthenticated} = useAuth0()
    const [isAddContactModalActive, setIsAddContactModalActive] = useState<boolean>(false)

    useEffect(() => {
        const getContacts = async () => {
            const {data} = await getAllContacts()
            if (data) {
                setContacts(data)
            }
        }

        getContacts()
    }, []);

    const removeContactFromArray = (id : number) => {
        console.log(id)
        setContacts(contacts.filter(e => e.id !== id))
    }

    return (
        <Flex className={contactPageClasses.wrapper}>
            <Flex vertical className={contactPageClasses.contactsPage}>
                <BackBtn/>
                <h1>Контакти</h1>
                <Flex vertical gap={10}>
                    {contacts.length > 0
                        ?
                        contacts.map((contact) =>
                            <Employee removeContactFromArray={removeContactFromArray}  key={"contact-" + contact.id} contact={contact}/>
                        )
                        :
                        <>
                            <Skeleton/>
                            <Skeleton/>
                            <Skeleton/>
                            <Skeleton/>
                        </>}
                </Flex>
                {isAuthenticated &&
                <>
                    <Button style={{width: 200, marginTop: 20, marginLeft: 20}}
                            type={"primary"}
                            onClick={() => setIsAddContactModalActive(true)}
                            icon={<PlusOutlined/>}>
                        Додати контакт
                    </Button>
                    <AddContactModal setContacts={setContacts}
                                     contacts={contacts}
                                     isOpen={isAddContactModalActive}
                                     setIsOpen={setIsAddContactModalActive}
                    />
                </>
                }
            </Flex>
        </Flex>
    );
};


interface AddContactModalProps {
    isOpen : boolean
    contacts : IContact[]
    setIsOpen :  React.Dispatch<React.SetStateAction<boolean>>
    setContacts :   React.Dispatch<React.SetStateAction<IContact[]>>
}
export type IContact = {
    id : number
    first_name: string;
    last_name: string;
    position: string;
    phone_number: string;
    email: string;
};

const AddContactModal: FC<AddContactModalProps> = ({isOpen, setIsOpen, setContacts, contacts}) => {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const {jwt} = useContext(AuthContext)
    // @ts-ignore
    const  onFinish: FormProps<IContact>['onFinish'] =  async (values) => {
        if (jwt) {
            setIsLoading(true)
            const {data, error} = await newContact(values, jwt)

            setIsLoading(false)
            if (data) {
                setContacts([...contacts, data])
                form.resetFields()
                setIsOpen(false)
            }
            if (error) {
                notification.error({message: "Виникла помилка :( Спробуйте ще раз!"})
            }
        } else {
            notification.warning({message: "Не авторизована дія!"})
        }

    };
    // const onFinishFailed: FormProps<Contact>['onFinishFailed'] = (errorInfo) => {
    //     console.log('Failed:', errorInfo);
    // };

    return (
        <Modal open={isOpen}
               onCancel={() => setIsOpen(false)}
                footer={false}
        >
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 800, marginRight: 20 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"

            >
                <Form.Item<IContact>
                    label="Ім'я"
                    name="first_name"
                    rules={[{ required: true, message: 'Будь ласка вкажіть ваше Ім\'я!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<IContact>
                    label="Прізвище"
                    name="last_name"
                    rules={[{ required: true, message: 'Будь ласка вкажіть ваше Прізвище!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<IContact>
                    label="Посада"
                    name="position"
                    rules={[{ required: true, message: 'Будь ласка вкажіть вашу посаду!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<IContact>
                    label="Телефон"
                    name="phone_number"
                    rules={[{ required: true, message: 'Будь ласка вкажіть ваш номер телефону!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<IContact>
                    label="Пошта"
                    name="email"
                    rules={[{ required: true, message: 'Будь ласка вкажіть вашу пошту!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button loading={isLoading}
                            type="primary"
                            htmlType="submit"
                    >
                        Додати
                    </Button>
                    <Button style={{marginLeft: 5}} onClick={() => setIsOpen(false)}>
                        Відмінити
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};



export {ContactsPage, AddContactModal};