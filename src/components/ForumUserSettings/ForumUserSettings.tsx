import React, {FC, useState} from 'react';
import {ForumUser} from "../../API/services/forum/ForumInterfaces";
import {Button, Drawer, Flex, Modal} from "antd";
import {SettingOutlined} from "@ant-design/icons";

interface ForumUserSettingsProps {
    user : ForumUser
}

const ForumUserSettings : FC<ForumUserSettingsProps> = ({user}) => {

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };
    return (
        <>
            <Button ghost onClick={showDrawer} icon={<SettingOutlined /> } >Налаштування</Button>
            <Drawer title="Мій профіль" onClose={onClose} open={open}>
                <Flex style={{height: "100%"}} vertical justify={"space-between"} gap={40}>
                    <Flex vertical style={{flex : 1}}>
                       <p>{user.nickname}</p>
                        <p>Зареєстровано: {user.registeredOn}</p>
                    </Flex>
                    <div>
                        <Button danger >Видалити профіль</Button>
                    </div>
                </Flex>
            </Drawer>
        </>

    );
};

export default ForumUserSettings;