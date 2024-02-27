
import {callAndGetResult} from "./ExternalApiService";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;


export const getUserAvatar = (url : string) => {
    const config = {
        url: url,
        method: "GET"
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