import {User} from "./ForumInterfaces";
import {apiServerUrl} from "../../Constants";
import {callAndGetResult} from "../ExternalApiService";


export interface IPost {
    id : number
    createdOn : string
    text : string
    author : User
    imageId : string
}

export const getLatestPosts = () => {
    const config = {
        url: `${apiServerUrl}/api/forum/posts/latest`,
        method: "GET",
    }
    return callAndGetResult(config)
}

export const newPost = (data : FormData,id : string, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/forum/user/${id}/post/new`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data : data
    }
    return callAndGetResult(config)
}