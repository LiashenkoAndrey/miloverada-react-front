import {API_SERVER_URL, DELETE_METHOD, PROTECTED_API} from "../../../Constants";
import {callAndGetResult} from "../shared/ExternalApiService";

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
        url: `${API_SERVER_URL}/api/text-banner/all`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export function getAllLinkBanners() {
    const config = {
        url: `${API_SERVER_URL}/api/link-banner/all`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export function deleteLinkBanner(id : number, jwt : string) {
    const config = {
        url: `${PROTECTED_API}/link-banner/${id}`,
        method: DELETE_METHOD,
        headers: {
            Authorization: `Bearer ${jwt}`,
        }
    }
    return callAndGetResult(config)
}
