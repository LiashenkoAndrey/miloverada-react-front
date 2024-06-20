import React, {FC} from 'react';
import {INotification} from "../../../API/services/NotificationService";
import {Badge, Flex} from "antd";
import {formatDate, toDateV2, toDateV2DateFirst} from "../../../API/Util";
import classes from './Notification.module.css'

interface NotificationProps {
    notification : INotification
    onClick : (notification : INotification) => void
}

const Notification:FC<NotificationProps> = ({notification, onClick}) => {
    return (
        <Badge dot={!notification.isViewed}>
            <Flex onClick={() => onClick(notification)}
                  vertical
                  className={classes.wrapper}
            >
                <span className={classes.message}>{notification.message}</span>

                <Flex gap={5} justify={"flex-end"} align={"flex-end"}>
                    <span className={classes.date}>{formatDate(notification.createdOn)}</span>
                    <img src={notification.author.avatarBase64Image ? notification.author.avatarBase64Image : notification.author.avatarUrl}
                         alt="автор"
                         height={25}
                         width={25}
                         style={{borderRadius: 10}}
                    />
                </Flex>
            </Flex>
        </Badge>
    );
};

export default Notification;