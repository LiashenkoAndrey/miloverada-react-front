import {callAndGetResult} from "../ExternalApiService";
import {apiServerUrl} from "../../Constants";

export const getLatestMessages = () => {
    const config = {
        url: `${apiServerUrl}/api/forum/message/latest`,
        method: "GET"
    }
    return callAndGetResult(config)
}