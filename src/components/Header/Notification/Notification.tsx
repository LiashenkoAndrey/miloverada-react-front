import React, {FC} from 'react';
import {INotification} from "../../../API/services/NotificationService";
import {Badge, Flex} from "antd";
import {toDateV2} from "../../../API/Util";
import classes from './Notification.module.css'

interface NotificationProps {
    notification : INotification
    onClick : (notification : INotification) => void
}

const Notification:FC<NotificationProps> = ({notification, onClick}) => {
    return (
        <Badge dot={!notification.isViewed}>
            <Flex onClick={() => onClick(notification)} vertical className={classes.wrapper}>
                <span className={classes.message}>{notification.message}</span>
            </Flex>
        </Badge>
    );
};

export default Notification;