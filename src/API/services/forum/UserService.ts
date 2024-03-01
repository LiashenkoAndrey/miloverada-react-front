import {NewUserDto} from "./ForumInterfaces";
import {callAndGetResult} from "../ExternalApiService";
import {apiServerUrl} from "../../Constants";

export const getAllUsers = () => {
    const config = {
        url: `${apiServerUrl}/api/forum/users`,
        method: "GET",
    }
    return callAndGetResult(config)
}


export const newUser = (user : NewUserDto, accessToken : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/user/new`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        data: user
    }
    return callAndGetResult(config)
}


export function isMyMessage(currentUserId : string | undefined, userId : string | undefined) {
    if(currentUserId && userId) {
        return currentUserId === userId
    }
    return false;
}

export const getActiveUsersAmount = () => {
    const config = {
        url: `${apiServerUrl}/api/forum/activeUsers`,
        method: "GET",
    }
    return callAndGetResult(config)
}


export const userIsRegistered = (userId : string, isAdmin : boolean, jwt : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/user/isRegistered/id/${encodeURIComponent(userId)}?isAdmin=${isAdmin}`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    }
    return callAndGetResult(config)
}
