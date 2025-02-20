import {callAndGetResult} from "../shared/ExternalApiService";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

export interface LinkBanner {
    id : number
    url : string
    text : string
    createdOn : string[]
}


export interface TextBanner {
    id : number
    description : string
    mainText : string
    createdOn : string[]
}


export const getAllTextBanners = () => {
    const config = {
        url: `${apiServerUrl}/api/text-banner/all`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export const getAllLinkBanners = () => {
    const config = {
        url: `${apiServerUrl}/api/link-banners?sort=createdOn,desc&size=10`,
        method: "GET"
    }
    return callAndGetResult(config)
}
