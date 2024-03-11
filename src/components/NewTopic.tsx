import React, {FC, useContext, useState} from 'react';
import {App, Button, Form, Input, Modal, Tooltip} from "antd";
import {PlusCircleOutlined} from "@ant-design/icons";
import useInput from "../API/hooks/useInput";
import {newTopic} from "../API/services/forum/TopicService";
import {Topic} from "../API/services/forum/ForumInterfaces";
import {AuthContext} from "../context/AuthContext";

interface NewTopicProps {
    isAuth? : boolean
}

const NewTopic: FC<NewTopicProps> = ({isAuth}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const { notification } = App.useApp();
    const {jwt} = useContext(AuthContext)
    const showModal = () => {
        setIsModalOpen(true);
    };


    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const topicName = useInput()
    const topicDesc = useInput()

    const onFinish = async (values: any) => {
        setIsModalOpen(false);
        const topic : Topic = {name: topicName.value, description : topicDesc.value}

        if (jwt) {
            const {data, error} = await newTopic(topic, jwt)

            if (data) {
                notification.success({message: "Успішно створено."})
            }

            if (error) {
                notification.error({message: "Невдалося створити тему. Внутрішня помилка"})
                throw new Error("error")

            }
        } else {
            throw Error("token is not present")
        }

    };



    return isAuth ?
      <>
          <Button  onClick={showModal}  ghost icon={<PlusCircleOutlined />}>Нова тема</Button>

          <Modal title="Нова тема" open={isModalOpen}  onCancel={handleCancel} footer={false} >
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
                      <Button type="primary" htmlType="submit">
                          Створити
                      </Button>
                  </Form.Item>
                  <Button onChange={handleCancel} type="default" >
                      Відміна
                  </Button>
              </Form>
          </Modal>
      </>
        :
        <Tooltip title="Вам потрібно авторизуватися" placement="topLeft">
            <Button ghost  onClick={showModal} icon={<PlusCircleOutlined/>}>Нова тема</Button>
        </Tooltip>
};

export default NewTopic;