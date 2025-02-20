import {callAndGetResult} from "../shared/ExternalApiService";
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

