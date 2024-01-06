import {NewUserDto} from "./ForumInterfaces";
import {callAndGetResult} from "../ExternalApiService";
import {apiServerUrl} from "../../Constants";


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


export const userIsRegistered = (userId : string, accessToken : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/user/isRegistered/id/${encodeURIComponent(userId)}`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        }
    }
    return callAndGetResult(config)
}
