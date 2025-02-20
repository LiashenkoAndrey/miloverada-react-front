import {callAndGetResult} from "../shared/ExternalApiService";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

export interface IAboutCommunity {
    id : string
    mainText : string
}

export const getAboutCommunity = () => {
    const config = {
        url: `${apiServerUrl}/api/aboutCommunity`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export const updateAboutCommunity = (data : FormData, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/aboutCommunity/update`,
        method: "PUT",
        data : data,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    return callAndGetResult(config)
}
