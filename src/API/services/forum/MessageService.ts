import {callAndGetResult} from "../ExternalApiService";
import {apiServerUrl} from "../../Constants";
import {Message, UpdateMessageDto} from "./ForumInterfaces";
import {Client} from "@stomp/stompjs";
import {MessageDto} from "./MessageDto";

export const getLatestMessages = () => {
    const config = {
        url: `${apiServerUrl}/api/forum/message/latest`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export const getLatestMessagesOfChat = (chatId : number) => {
    const config = {
        url: `${apiServerUrl}/api/forum/chat/${chatId}/message/latest`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export const getPreviousMessagesOfChat = (chatId : number, fromMessageId : number) => {
    const config = {
        url: `${apiServerUrl}/api/forum/chat/${chatId}/messages/previous?fromMessageId=${fromMessageId}`,
        method: "GET"
    }
    return callAndGetResult(config)
}


export const publishNewMessage = (client :  Client, messageDto : MessageDto) => {
    const body = JSON.stringify(messageDto)
    client.publish({
        destination: '/app/userMessage/new',
        body: body,
        headers: {
            'content-type': 'application/json'
        }}
    )
}



export const deleteMessageById = (id : number, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/forum/message/${id}/delete`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    return callAndGetResult(config)
}

export const updateMessage = (message : UpdateMessageDto, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/forum/message/update`,
        method: "PUT",
        data: message,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    return callAndGetResult(config)
}

export const observeMessage = (observer: IntersectionObserver, messages : Message[]) => {
    if (messages.length > 0) {
        const observerTargetMessage = messages[Math.round((messages.length / 2) / 2)].id;
        let target = document.getElementById("msgId-" + observerTargetMessage)
        if (target) {
            observer.observe(target)
        }
    }
}