import {callAndGetResult} from "../shared/ExternalApiService";
import {AppUser} from "../forum/ForumInterfaces";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

export interface INewsComment {
    id : number
    newsId : number
    replies : INewsComment[]
    text : string
    createdOn : string
    editedOn : string
    author : AppUser
}

export const getAllNewsCommentsById = (id : number) => {
    const config = {
        url: `${apiServerUrl}/api/news/${id}/comments`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export const deleteNewsCommentById = (id : number, jwt : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/news/comment/${id}/delete`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    }
    return callAndGetResult(config)
}

export const saveNewsComment = (data : Object) => {
    const config = {
        url: `${apiServerUrl}/api/news/comment/new`,
        method: "POST",
        data : data,
    }
    return callAndGetResult(config)
}