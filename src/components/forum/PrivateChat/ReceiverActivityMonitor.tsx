import React, {FC, useEffect} from 'react';
import {useActions} from "../../../hooks/useActions";
import {useSubscription} from "react-stomp-hooks";
import {IMessage} from "@stomp/stompjs/src/i-message";
import {PrivateChat} from "../../../API/services/forum/ForumInterfaces";
import {UserOnlineStatusChanged} from "../../../API/services/forum/UserService";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {setChatInfo} from "../../../store/actionCreators/chat";
import {formatDate, formatDateWithTime} from "../../../API/Util";

export interface ReceiverActivityMonitorProps {
    privateChatInfo : PrivateChat
}

const ReceiverActivityMonitor :FC<ReceiverActivityMonitorProps> = ({privateChatInfo}) => {
    const {setPrivateChatInfo, setChatInfo} = useActions()
    const {chatInfo} = useTypedSelector(state => state.chat)

    const receiverOnlineStatusChanged = (message : IMessage) => {
        const data : UserOnlineStatusChanged = JSON.parse(message.body)
        console.log("receiverOnlineStatusChanged !!!!!!!!!!!!!!!! ", data)
        updateReceiverOnlineStatus(data.isOnline, data.date)
    }

    const updateReceiverOnlineStatus = (isOnline : boolean, date : string) => {
        if (privateChatInfo && chatInfo) {
            privateChatInfo.receiver.isOnline = isOnline
            privateChatInfo.receiver.lastWasOnline = date

            setPrivateChatInfo(privateChatInfo)
            chatInfo.description = isOnline ? "в мережі" : `був(ла) в мережі ${formatDateWithTime(privateChatInfo.receiver.lastWasOnline).toLowerCase()}`
        } else {
            console.log("privateChatInfo or chatInfo NULLL")
        }
    }

    useSubscription(`/chat/user/${privateChatInfo.sender.id}/onlineStatus` , receiverOnlineStatusChanged)


    return (
       <></>
    );
};

export default ReceiverActivityMonitor;