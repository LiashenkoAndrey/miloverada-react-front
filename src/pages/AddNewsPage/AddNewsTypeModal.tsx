import React, {FC, useContext, useEffect, useState} from 'react';
import {App, Button, Flex, Input, Modal} from "antd";
import {NewsType, saveNewsType} from "../../API/services/NewsService";
import {AuthContext} from "../../context/AuthContext";

interface AddNewsTypeModal {
    isNewType : boolean
    newsTypes: NewsType[]
    setNewsTypes: React.Dispatch<React.SetStateAction<NewsType[]>>
    setIsModalOpen:  React.Dispatch<React.SetStateAction<boolean>>
    isModalOpen: boolean
    setNewsTypeId: React.Dispatch<React.SetStateAction<number | undefined>>
}

const AddNewsTypeModal: FC<AddNewsTypeModal> = ({isNewType,
                                                    setNewsTypes,
                                                    newsTypes,
                                                    isModalOpen,
                                                    setIsModalOpen, setNewsTypeId}) => {

    const [title, setTitle] = useState<string>('')
    const [explanation,  setExplanation] = useState<string>('')
    const [isLoading,  setIsLoading] = useState<boolean>(false)
    const {notification} = App.useApp();
    const {jwt} = useContext(AuthContext)

    useEffect(() => {
        console.log(jwt)
    }, [jwt]);


    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onSave = async () => {
        setIsModalOpen(false);
        if (title === '') {
            notification.warning({message: "Назва має бути заповнена"})
            return
        }
        if (jwt) {
            setIsLoading(true)
            const {data, error} = await saveNewsType({title: title, titleExplanation: explanation}, jwt)
            setIsLoading(false)
            if (data) {
                const savedNewsType : NewsType = data;
                setNewsTypes([savedNewsType, ...newsTypes])
                setNewsTypeId(savedNewsType.id)
                setIsModalOpen(false)
            }
            if (error) notification.warning({message: "Помилка при збереженні"})
        } else notification.warning({message: "not auth"})
    }

    return (
        <>
            {isModalOpen &&
                <Modal  zIndex={2147483647} centered open={isModalOpen}
                       title={"Нова тема"}
                       onCancel={handleCancel}
                       footer={[<Button onClick={handleCancel}>Відмінити</Button>, <Button loading={isLoading} type={"primary"} onClick={onSave}>Зберегти</Button>]}
                >
                    <Flex wrap={"wrap"}  >
                        <Flex gap={10} vertical style={{width: "100%"}}>
                            <span>Назва теми <span style={{color: "red"}}>*</span></span>
                            <Input onChange={(e) => setTitle(e.target.value)} value={title} type="text"/>
                        </Flex>

                        <Flex gap={10} vertical style={{width: "100%"}}>
                            <span>Опис теми</span>
                            <Input onChange={(e) => setExplanation(e.target.value)} value={explanation} type="text"/>
                        </Flex>
                    </Flex>
                </Modal>
            }
        </>
    );
};

export default AddNewsTypeModal;