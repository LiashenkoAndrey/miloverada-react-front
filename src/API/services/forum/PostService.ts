import {ForumUser, User} from "./ForumInterfaces";
import {apiServerUrl} from "../../Constants";
import {callAndGetResult} from "../ExternalApiService";


export interface IPost {
    id : number
    createdOn : string
    text : string
    author : ForumUser
    imageId : string
    isUserLikedPost : boolean
    likesAmount : number
    commentsTotalAmount : number
    comments : IPostComment[]
}

export interface IPostComment {
    id : number
    createdOn : string
    text : string
    author : ForumUser
}

export const getLatestPosts = (encodedForumUserId? : string) => {
    console.log(encodedForumUserId)
    const config = {
        url: encodedForumUserId ? `${apiServerUrl}/api/forum/posts/latest?encodedForumUserId=` + encodedForumUserId  : `${apiServerUrl}/api/forum/posts/latest`,
        method: "GET",
    }
    return callAndGetResult(config)
}

export const likeOrDislikePost = (postId : number, encodedForumUserId : string, jwt : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/forum/post/${postId}/likeOrDislike?encodedForumUserId=` + encodedForumUserId,
        method: "PUT",
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
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