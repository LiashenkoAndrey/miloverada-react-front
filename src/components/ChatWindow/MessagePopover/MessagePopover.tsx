import React, {FC} from 'react';
import Icon from "@ant-design/icons";

interface MessagePopoverProps {
    xPos : number,
    yPos : number,
    visible : boolean
}

const MessagePopover : FC<MessagePopoverProps> = ({xPos, yPos, visible}) => {
    return (
        <ul className="popup" style={{left: `${xPos}px`, top: `${yPos}px`, display : visible ? "block" : "none", position: "absolute"}}>
            <li><Icon type="user"/>{345}</li>
            <li><Icon type="heart-o"/>Like it</li>
            <li><Icon type="star-o"/>Bookmark</li>
        </ul>
    );
};

export default MessagePopover;