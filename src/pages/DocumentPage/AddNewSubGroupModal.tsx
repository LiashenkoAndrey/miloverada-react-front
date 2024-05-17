import React, {FC, useContext, useState} from 'react';
import {App, Button, Flex, Input, Modal} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {addNewSubGroup} from "../../API/services/DocumentService";
import {AuthContext} from "../../context/AuthContext";
import {IDocumentGroup} from "../../API/services/InstitutionService";

interface AddNewSubGroupModalProps {
    groupId : number | null
    addGroup : (group : IDocumentGroup) => void
    newGroupRef? :  React.MutableRefObject<null>
}

const AddNewSubGroupModal: FC<AddNewSubGroupModalProps> = ({groupId, addGroup, newGroupRef}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState<string>('')
    const {jwt} = useContext(AuthContext)
    const {notification} = App.useApp();


    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        const formData =  new FormData()
        formData.append("name", name)
        setName("")
        if (name === '') {
            notification.warning({message: "Поле має бути заповненим"})
            return
        }
        if (jwt) {
            const {data, error} = await addNewSubGroup(formData, groupId, jwt)
            if (data) {
                const group : IDocumentGroup = data
                addGroup(group)
                initGroupBeforeInserting(group)
            }
            if (error) throw error

        } else notification.error({message: "not auth"})
        setIsModalOpen(false);
    };

    function initGroupBeforeInserting(group : IDocumentGroup) {
        group.groups = []
        group.documents = [];
    }

    const handleCancel = () => {
        setIsModalOpen(false);
    };


    return (
        <>
            <Button ref={newGroupRef} onClick={showModal} style={{width: "fit-content"}} icon={<PlusOutlined/>}>Додати {groupId == null ? "групу" : "підгрупу"}</Button>
            <Modal title={"Додати підгрупу"} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Flex wrap={"wrap"}  >
                    <Flex gap={10} vertical style={{width: "100%"}}>
                        <span>Назва {groupId == null ? "групи" : "підгрупи"}<span style={{color: "red"}}>*</span></span>
                        <Input onChange={(e) => setName(e.target.value)} value={name} type="text"/>
                    </Flex>

                </Flex>
            </Modal>
        </>
    );
};

export default AddNewSubGroupModal;