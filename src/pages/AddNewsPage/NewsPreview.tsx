import React, {FC, useState} from 'react';
import {Button, Modal} from "antd";
import NewsPage from "../NewsPage/NewsPage";



const NewsPreview: FC = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
            <Button onClick={showModal}>Попередній перегляд</Button>
            <Modal style={{width: "90vw"}}
                   width={"100vw"}
                   title="Попередній перегляд"
                   open={isModalOpen} onOk={handleOk}
                   footer={[<Button onClick={handleCancel}>Назад</Button>]}
                   onCancel={handleCancel}
            >
                <NewsPage isPreview={true} />
            </Modal>
        </>
    );
};

export default NewsPreview;