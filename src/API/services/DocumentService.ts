import {callAndGetResult} from "./ExternalApiService";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

export const getAllDocumentsGroups = () => {
    const config = {
        url: `${apiServerUrl}/api/documentGroup/all`,
        method: "GET"
    }
    return callAndGetResult(config)
}


export const getAllDocumentsBySubGroupId = (subGroupId : number) => {
    const config = {
        url: `${apiServerUrl}/api/documents?subGroupId=${subGroupId}`,
        method: "GET"
    }
    return callAndGetResult(config)
}
