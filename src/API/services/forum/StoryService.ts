import {Topic, User} from "./ForumInterfaces";
import {callAndGetResult} from "../shared/ExternalApiService";
import {apiServerUrl} from "../../Constants";


export interface IStory {
    id : number
    createdOn : string
    text : string
    author : User
    imageId : string
}

export const newTopic = (data : FormData,id : string, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/forum/user/${id}/story/new`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data : data
    }
    return callAndGetResult(config)
}

export const getLatestStories = () => {
    const config = {
        url: `${apiServerUrl}/api/forum/stories/latest`,
        method: "GET",
    }
    return callAndGetResult(config)
}

