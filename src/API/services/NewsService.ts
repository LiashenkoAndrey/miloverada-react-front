import {callAndGetResult} from "./ExternalApiService";



const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

export const getAllNews = () => {
    const config = {
        url: `${apiServerUrl}/api/news/all?pageSize=6`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export const getNewsById = (newsId : number | undefined) => {
    const config = {
        url: `${apiServerUrl}/api/news/${newsId}`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export const getSimilarNews = (newsId : number) => {
    const config = {
        url: `${apiServerUrl}/api/news/${newsId}/similar`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export const getLatestNews = (pageSize: number) => {
    const config = {
        url: pageSize !== -1 ? `${apiServerUrl}/api/news/latest?pageSize=${pageSize}` : `${apiServerUrl}/api/news/latest`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export const incrementNewsViews = (id : number) => {
    const config = {
        url: `${apiServerUrl}/api/news/${id}/incrementViews`,
        method: "POST"
    }
    return callAndGetResult(config)
}