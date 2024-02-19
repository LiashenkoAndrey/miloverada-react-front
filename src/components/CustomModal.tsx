import React, {FC, ReactChild, ReactNode, useState} from 'react';
import {Button, Modal} from "antd";

interface CustomModalProps {
    onOk : () => void
    children : ReactChild
}

const CustomModal: FC<CustomModalProps> = ({children}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Open Modal
            </Button>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                {children}
            </Modal>
        </>
    );
};

export default CustomModal;