import React, {FC, useContext, useState} from 'react';
import {App, Button, Flex, Form, Input, Modal} from "antd";
import useInput from "../API/hooks/useInput";
import {newChat} from "../API/services/forum/ChatService";
import {NewChat} from "../API/services/forum/ForumInterfaces";
import {useAuth0} from "@auth0/auth0-react";
import {AuthContext} from "../context/AuthContext";

interface NewChatModalProps {
    topicId : number
}

const NewChatModal : FC<NewChatModalProps> = ({topicId}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const name = useInput()
    const description = useInput()
    const pictureUrl = useInput()
    const {  notification } = App.useApp();
    const {user, isAuthenticated} = useAuth0()
    const {jwt, setJwt} = useContext(AuthContext)

    const showModal = () => {
        setIsModalOpen(true);
    };

    const onFinish = async () => {
        if (name.value && description.value && pictureUrl.value && user?.sub) {

            const chat : NewChat = {
                name: name.value,
                description: description.value,
                picture : pictureUrl.value,
                ownerId : user.sub,
                topicId : topicId
            }

            console.log(chat)
            if (jwt) {

                const {data, error} = await newChat(chat, jwt)

                if (data) {
                    console.log(data)
                    handleCancel()
                    notification.success({message: "Чат створено!"})
                }

                if (error) throw error
            } else notification.error({message: "token is undefined"})

        } else notification.error({message: "error then validate chat params"})
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            {isAuthenticated
                &&
                <Flex>
                    <Button color={"yellow"} onClick={showModal}  type={"primary"}>Створити новий чат</Button>
                </Flex>
            }

            <Modal title={"Новий чат"} footer={false} open={isModalOpen}  onCancel={handleCancel}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Назва"
                        rules={[{ required: true, message: 'Має бути заповненим!' }]}
                    >
                        <Input {...name} />
                    </Form.Item>

                    <Form.Item
                        label="Опис"
                        rules={[{ required: true, message: 'Має бути заповненим!' }]}
                    >
                        <Input {...description} />
                    </Form.Item>

                    <Form.Item
                        label="Картинка (url)"
                        rules={[{ required: true, message: 'Має бути заповненим!' }]}
                    >
                        <Input {...pictureUrl} />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Створити новий чат
                        </Button>
                    </Form.Item>
                    <Button onChange={handleCancel} type="default" >
                        Відміна
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default NewChatModal;