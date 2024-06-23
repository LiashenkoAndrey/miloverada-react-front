import React, {useState, useEffect, useCallback} from 'react';
import {useActions} from "../../../hooks/useActions";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {useStompClient} from "react-stomp-hooks";
import {UpdateUserOnlineStatusDto} from "../../../API/services/forum/UserService";

const SenderActivityMonitor = () => {
    const [isActive, setIsActive] = useState(true);
    const [lastActivityTime, setLastActivityTime] = useState(Date.now());
    const {setChatInfo, setPrivateChatInfo} = useActions()
    const {chatId, privateChatInfo} = useTypedSelector(state => state.chat)
    const stompClient = useStompClient()
    const [needsToNotifyReceiverThatYouOnline, setNeedsToNotifyReceiverThatYouOnline] = useState(false)

    const updateSenderOnlineStatus = useCallback((isOnline : boolean) => {
        console.log("updateSenderOnlineStatus isOnline =", isOnline)

        if (!stompClient || !privateChatInfo) {
            console.log("stompClient or privateChatInfo is null", stompClient, privateChatInfo)
            return
        }


        let dto : UpdateUserOnlineStatusDto = {
            userIdThatOnlineStatusNeedsToBeUpdated : privateChatInfo.sender.id,
            userIdThatNeedsNotification : privateChatInfo.receiver.id,
            isOnline : isOnline
        }
        // console.log("updateSenderOnlineStatus send!", dto)
        stompClient.publish({
            destination: '/app/forumUser/isOnlineStatus',
            body: JSON.stringify(dto),
            headers: {
                'content-type': 'application/json'
            }}
        ) 
    }, [privateChatInfo, stompClient]);



    /**
     * Notify receiver that you are not active now
     */
    const setNotActive = () => {
        console.log("setNotActive")
        updateSenderOnlineStatus(false)
        setNeedsToNotifyReceiverThatYouOnline(true)
        setIsActive(false)
    }

    /**
     * If you were not active and have started activity - notify receiver
     */
    useEffect(() => {
        if (needsToNotifyReceiverThatYouOnline && isActive) {
            console.log("NotifyReceiverThatYouOnline!!!!", isActive)
            updateSenderOnlineStatus(true)
            setNeedsToNotifyReceiverThatYouOnline(false)
        }
    }, [isActive]);

    useEffect(() => {
        let timeout = setTimeout(setNotActive, 5000); // Adjust timeout period as needed (e.g., 5000 ms = 5 seconds)

        // Event listeners for user interaction

        const resetTimeout = () => {
            clearTimeout(timeout)
            timeout = setTimeout(setNotActive, 5000)
            console.log("set active")
            setIsActive(true); // User is active when interacting
        };
        document.addEventListener('mousemove', resetTimeout);
        document.addEventListener('mousedown', resetTimeout);
        document.addEventListener('keypress', resetTimeout);
        document.addEventListener('keydown', resetTimeout);
        document.addEventListener('touchmove', resetTimeout);
        document.addEventListener('scroll', resetTimeout);


        return () => {
            console.log("remove all")
            // Clean up event listeners
            document.removeEventListener('mousemove', resetTimeout);
            document.removeEventListener('keypress', resetTimeout);
            clearTimeout(timeout);
        };
    }, []); // Empty dependency array ensures effect runs only on mount and unmount


    return (
        <>
            {/*<h1 style={{color: 'white'}}>User is {isActive ? 'Active' : 'Inactive'}</h1>*/}
        </>
    );
};

export default SenderActivityMonitor;
