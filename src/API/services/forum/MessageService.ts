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

export const getNextMessagesOfChat = (chatId : number, fromMessageId : number) => {
    const config = {
        url: `${apiServerUrl}/api/forum/chat/${chatId}/messages/next?fromMessageId=${fromMessageId}`,
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

export const observePreviousMessagesLoadingTrigger = (observer: IntersectionObserver, messages : Message[]) => {
    if (messages.length > 0) {
        const observerTargetMessage = messages[Math.round((messages.length / 2) / 2)].id;
        let target = document.getElementById("msgId-" + observerTargetMessage)
        // console.log("prev target", target, observerTargetMessage)
        if (target) {
            observer.observe(target)
        }
    }
}

export const observeNextMessagesLoadingTrigger = (observer: IntersectionObserver, messages : Message[]) => {
    if (messages.length > 0) {
        const middle = messages.length / 2;
        const index = Math.round(middle + (middle / 2) + (middle / 4))
        const observerTargetMessage = messages[index].id;
        let target = document.getElementById("msgId-" + observerTargetMessage)
        // console.log("target", target, observerTargetMessage)
        if (target) {
            observer.observe(target)
        }
    }
}

export function getIndexOfMessage(lastReadMessageId : number | undefined) : number {
    if (lastReadMessageId) {
        const lastReadMessage = document.getElementById("msgWrapper-" + lastReadMessageId)
        const index = lastReadMessage?.getAttribute("data-index")
        if (index) {
            return Number(index)
        }
    }
    throw new Error("data-index attribute not present")
}
