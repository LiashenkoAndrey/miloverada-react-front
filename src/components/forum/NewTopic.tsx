import React, {FC, useContext, useState} from 'react';
import {App, Button, Form, Input, Modal, Tooltip} from "antd";
import {PlusCircleOutlined} from "@ant-design/icons";
import useInput from "../../API/hooks/useInput";
import {newTopic} from "../../API/services/forum/TopicService";
import {Topic} from "../../API/services/forum/ForumInterfaces";
import {AuthContext} from "../../context/AuthContext";
import {useActions} from "../../hooks/useActions";
import {useTypedSelector} from "../../hooks/useTypedSelector";

interface NewTopicProps {
    isOpen : boolean
    setIsOpen :  React.Dispatch<React.SetStateAction<boolean>>
}

const NewTopic: FC<NewTopicProps> = ({ isOpen, setIsOpen}) => {
    const { notification } = App.useApp();
    const {jwt} = useContext(AuthContext)
    const {topics} = useTypedSelector(state => state.forum)
    const {setTopics} = useActions()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleCancel = () => {
        setIsOpen(false);
    };

    const topicName = useInput()
    const topicDesc = useInput()

    const onFinish = async (values: any) => {
        setIsOpen(false);
        const topic : Topic = {name: topicName.value, description : topicDesc.value}

        if (jwt) {
            setIsLoading(true)
            const {data, error} = await newTopic(topic, jwt)
            setIsLoading(false)

            if (data) {
                console.log(data)
                notification.success({message: "Успішно створено."})
                setTopics([...topics, data])
            }

            if (error) {
                notification.error({message: "Невдалося створити тему. Внутрішня помилка"})
                throw new Error("error")

            }
        } else {
            throw Error("token is not present")
        }

    };

    return (
        <>
          <Modal title="Нова тема" open={isOpen}  onCancel={handleCancel} footer={false} >
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
                      <Input {...topicName} />
                  </Form.Item>

                  <Form.Item
                      label="Опис"
                      rules={[{ required: true, message: 'Має бути заповненим!' }]}
                  >
                      <Input {...topicDesc} />
                  </Form.Item>


                  <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                      <Button loading={isLoading} type="primary" htmlType="submit">
                          Створити
                      </Button>
                  </Form.Item>
                  <Button onChange={handleCancel} type="default" >
                      Відміна
                  </Button>
              </Form>
          </Modal>
      </>
    )
};

export default NewTopic;