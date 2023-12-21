import {callAndGetResult} from "../ExternalApiService";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;
export const getAllTopics = () => {
    const config = {
        url: `${apiServerUrl}/api/forum/topic/all`,
        method: "GET"
    }
    return callAndGetResult(config)
}