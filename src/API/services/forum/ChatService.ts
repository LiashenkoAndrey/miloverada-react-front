import {callAndGetResult} from "../shared/ExternalApiService";
import {NewChat} from "./ForumInterfaces";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;


export const getOrCreatePrivateChat = (user1_id : string, user2_id : string, accessToken : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/forum/user/${user1_id}/chat?user2_id=${user2_id}`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }
    return callAndGetResult(config)
}

export const getUserVisitedChats = (userId : string, jwt : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/forum/user/${userId}/chats`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    }
    return callAndGetResult(config)
}


export const getChatById = (chatId : number, userId? : string) => {
    console.log("get chat", chatId, `${apiServerUrl}/api/forum/chat/id/${chatId}` + (userId ? `?encodedUserId=${userId}` : ""))
    const config = {
        url: `${apiServerUrl}/api/forum/chat/id/${chatId}` + (userId ? `?encodedUserId=${userId}` : ""),
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
