import {callAndGetResult} from "../shared/ExternalApiService";
import {AppUser} from "../forum/ForumInterfaces";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

export interface INotification {
    id : number,
    message : string,
    text : string
    createdOn : string
    updatedOn : string
    author : AppUser
    isViewed : boolean
}
export interface INewNotification {
    message? : string,
    text? : string
    authorId? : string
}

export interface IEditNotification {
    message? : string,
    text? : string
}

export const getAllNotifications = (userId : string, jwt : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/admin/notification/all?encodedUserId=${userId}`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    }
    return callAndGetResult(config)
}

export const getNotificationById = (id : number, isViewed : boolean, userId : string, jwt : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/admin/notification/${id}?isViewed=${isViewed}&encodedUserId=${userId}`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    }
    return callAndGetResult(config)
}


export const getTotalNumberOfNotifications = (userId : string, jwt : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/admin/notification/totalNumber?encodedUserId=${userId}`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    }
    return callAndGetResult(config)
}

export const deleteNotificationById = (id : number,jwt : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/admin/notification/${id}/delete`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    }
    return callAndGetResult(config)
}


export const newNotification = (data : INewNotification, jwt : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/admin/notification/new`,
        method: "POST",
        data : data,
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    }
    return callAndGetResult(config)
}

export const editNotification = (data : IEditNotification, id : number, jwt : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/admin/notification/${id}/edit`,
        method: "PUT",
        data : data,
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    }
    return callAndGetResult(config)
}
