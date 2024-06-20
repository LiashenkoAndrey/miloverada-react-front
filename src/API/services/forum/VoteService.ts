import {apiServerUrl} from "../../Constants";
import {callAndGetResult} from "../ExternalApiService";

export interface NewVoteDto {
    text : string
    authorId : string,
    options : string[]
}

export interface IVote {
    id : string
    text : string
    authorId : string,
    createdOn : string,
    options : string[]
}

export const newPageVote = (data : NewVoteDto, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/forum/pageVote/new`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data : data
    }
    return callAndGetResult(config)
}

export const getPageVotes = () => {
    const config = {
        url : `${apiServerUrl}/api/forum/pageVote/latest`,
        method: "GET",
    }
    return callAndGetResult(config)
}
