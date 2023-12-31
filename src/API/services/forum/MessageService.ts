import {callAndGetResult} from "../ExternalApiService";
import {apiServerUrl} from "../../Constants";
import {Message, UpdateMessageDto} from "./ForumInterfaces";

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