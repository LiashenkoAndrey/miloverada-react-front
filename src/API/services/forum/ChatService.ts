import {callAndGetResult} from "../ExternalApiService";
import {NewChat} from "./ForumInterfaces";

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

export const getChatMetadata = (chatId : number, userId : string) => {
    const config = {
        url: `${apiServerUrl}/api/forum/chat/id/${chatId}/metadata?userId=${userId}`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export const getMessagesByChatIdAndLastReadMessage = (chatId : number, page : number, size : number, lastReadMessageId : number) => {

    const config = {
        url: `${apiServerUrl}/api/forum/message/all?chatId=${chatId}&pageIndex=${page}&pageSize=${size}&lastReadMessageId=${lastReadMessageId}`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export const getNewPageOfMessagesAuthUser = (chatId : number, page : number, size : number, lastReadMessageId : number) => {

    const config = {
        url: `${apiServerUrl}/api/forum/message/newPage?chatId=${chatId}&pageIndex=${page}&pageSize=${size}&lastReadMessageId=${lastReadMessageId}`,
        method: "GET"
    }
    return callAndGetResult(config)
}




export const newChat = (chat : NewChat, accessToken : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/forum/chat/new`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: chat
    }
    return callAndGetResult(config)
}
