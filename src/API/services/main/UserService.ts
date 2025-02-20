
import {callAndGetResult} from "../shared/ExternalApiService";
import {AppUser, NewUserDto} from "../forum/ForumInterfaces";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

export interface AdminMetadata {
    userId : string
    isDocumentsPageTourCompleted : boolean
    isShowConfirmWhenDeleteDocument : boolean
    isShowModalTourWhenUserOnDocumentsPage : boolean
}

export interface UserDto {
    isRegistered : boolean
    adminMetadata? : AdminMetadata
    appUser? : AppUser
}

export const getUserAvatar = (url : string) => {
    const config = {
        url: url,
        method: "GET"
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

export const updateAdminMeta = (adminMeta : AdminMetadata, jwt : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/user/adminMeta/update`,
        method: "PUT",
        data : adminMeta,
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    }
    return callAndGetResult(config)
}

export const getAppUser = (id : string, jwt : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/appUser/${id}`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    }
    return callAndGetResult(config)
}

export const getUserById = (id : string, jwt : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/user/id/${id}`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    }
    return callAndGetResult(config)
}