import {callAndGetResult} from "../ExternalApiService";
import {MessageDto} from "./MessageDto";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

export const getAllChats = () => {
    const config = {
        url: `${apiServerUrl}/api/forum/chat/all`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export const getAllChatsByThemeId = (topicId : number) => {
    const config = {
        url: `${apiServerUrl}/api/forum/chat/all?topicId=${topicId}`,
        method: "GET"
    }
    return callAndGetResult(config)
}


export const getChatById = (chatId : number) => {
    const config = {
        url: `${apiServerUrl}/api/forum/chat/id/${chatId}`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export const getAllMessagesByChatId = (chatId : number) => {
    const config = {
        url: `${apiServerUrl}/api/forum/message/all?chatId=${chatId}`,
        method: "GET"
    }
    return callAndGetResult(config)
}


export const newMessage = (message : MessageDto) => {
    const config = {
        url: `${apiServerUrl}/api/forum/message/new`,
        method: "POST",
        data: message,
        headers: {
            ContentType: "application/json"
        }
    }
    return callAndGetResult(config)
}
