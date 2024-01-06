import {callAndGetResult} from "../ExternalApiService";
import {apiServerUrl} from "../../Constants";

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