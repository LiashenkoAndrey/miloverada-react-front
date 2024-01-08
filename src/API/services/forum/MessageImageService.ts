import {callAndGetResult} from "../ExternalApiService";
import {apiServerUrl} from "../../Constants";


export const deleteMessageImageById = (imageId : string, messageId : number , token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/forum/message/${messageId}/image/${imageId}/delete`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    return callAndGetResult(config)
}

export const updateMessageImage = (id : string, newImageBase64 : string, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/forum/messageImage/${id}/update`,
        method: "PUT",
        data : {
            base64Image : newImageBase64
        },
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    return callAndGetResult(config)
}