import {callAndGetResult} from "../ExternalApiService";
import {Topic} from "./ForumInterfaces";
const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

export const getAllTopics = () => {
    const config = {
        url: `${apiServerUrl}/api/forum/topic/all`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export const newTopic = (topic : Topic, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/forum/topic/new`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data : topic
    }
    return callAndGetResult(config)
}

export const getTopicById = (id : number) => {
    const config = {
        url: `${apiServerUrl}/api/forum/topic/id/${id}`,
        method: "GET",
    }
    return callAndGetResult(config)
}