import React, {FC, useContext, useState} from 'react';
import {App, Button, Form, Input, Modal} from "antd";
import useInput from "../API/hooks/useInput";
import {newChat} from "../API/services/forum/ChatService";
import {NewChat} from "../API/services/forum/ForumInterfaces";
import {useAuth0} from "@auth0/auth0-react";
import {AuthContext} from "../context/AuthContext";
import {TopicInfo} from "../pages/forum/AllTopicsPage/TopicsList/TopicsList";
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useActions} from "../hooks/useActions";

interface NewChatModalProps {
    topicInfo : TopicInfo
    isOpen : boolean
    setIsOpen :  React.Dispatch<React.SetStateAction<boolean>>
}

const NewChatModal : FC<NewChatModalProps> = ({topicInfo, isOpen, setIsOpen}) => {
    const name = useInput()
    const description = useInput()
    const pictureUrl = useInput()
    const {  notification } = App.useApp();
    const {user, isAuthenticated} = useAuth0()
    const {jwt} = useContext(AuthContext)
    const {topics} = useTypedSelector(state => state.forum)
    const {setTopics} = useActions()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const onFinish = async () => {
        if (name.value && description.value && user?.sub && topicInfo.topicId) {
            console.log(topicInfo.topicId)
            const chat : NewChat = {
                name: name.value,
                description: description.value,
                ownerId : user.sub,
                topicId : topicInfo.topicId
            }

            if (pictureUrl) {
                chat.picture = pictureUrl.value
            }

            console.log(chat)
            if (jwt) {
                setIsLoading(true)
                const {data, error} = await newChat(chat, jwt)
                setIsLoading(false)

                if (data) {
                    console.log(data)
                    handleCancel()
                    notification.success({message: "Чат створено!"})
                    const topic = topics.find((e) => e.id === topicInfo.topicId)
                    if (topic) {
                        const index = topics.indexOf(topic);
                        topics[index].chats.push(data)
                        console.log(topics)
                        setTopics(topics)
                        name.value = ''
                        description.value = ''
                        pictureUrl.value = ''

                    } else console.error('topic not found: unexpected behavior')
                    setIsOpen(false)
                }

                if (error) throw error
            } else notification.error({message: "token is undefined"})

        } else notification.error({message: "error then validate chat params"})
    }

    const handleCancel = () => {
        setIsOpen(false);
    };
    return (
            <Modal title={"Новий чат в темі " + topicInfo.topicName} footer={false} open={isOpen}  onCancel={handleCancel}>
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
                        <Button loading={isLoading} type="primary" htmlType="submit">
                            Створити новий чат
                        </Button>
                    </Form.Item>
                    <Button onChange={handleCancel} type="default" >
                        Відміна
                    </Button>
                </Form>
            </Modal>
    );
};

export default NewChatModal;