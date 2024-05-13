import {callAndGetResult} from "./ExternalApiService";



const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;



export const getAllNews = () => {
    const config = {
        url: `${apiServerUrl}/api/news/all?pageSize=6`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export const saveNews = (data : FormData, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/news/new`,
        method: "POST",
        data : data,
        headers: {
            Authorization: `Bearer ${token}`,
        }
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

export const getLatestNews = (pageSize: number, pageNumber? : number) => {
    const config = {
        url: pageSize !== -1 ? `${apiServerUrl}/api/news/latest?pageSize=${pageSize}` + (pageNumber ? `&pageNumber=${pageNumber}` : '') : `${apiServerUrl}/api/news/latest`,
        method: "GET"
    }
    return callAndGetResult(config)
}


export interface NewsType {
    id? : number
    title : string
    titleExplanation : string
}

export const getNewsTypesList = (token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/news-types`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    return callAndGetResult(config)
}

export const saveNewsType = (newsType : NewsType, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/newsType/new`,
        method: "POST",
        data: newsType,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    return callAndGetResult(config)
}

export const deleteNewsTypeById = (newsTypeId : number, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/newsType/${newsTypeId}/delete`,
        method: "DELETE",
        data: newsTypeId,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    return callAndGetResult(config)
}

export const deleteNewsById = (newsId : number, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/news/${newsId}/delete`,
        method: "DELETE",
        data: newsId,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    return callAndGetResult(config)
}

export const deleteNewsImageById = (imageId : string, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/news/image/${imageId}/delete`,
        method: "DELETE",
        data: imageId,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    return callAndGetResult(config)
}

export const updateNewsById = (newsId : number, data : FormData, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/news/${newsId}/update`,
        method: "PUT",
        data: data,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    return callAndGetResult(config)
}


export const saveNewsImageByNewsId = (data : FormData, newsId : number, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/news/${newsId}/image/new`,
        method: "POST",
        data: data,
        headers: {
            Authorization: `Bearer ${token}`,
        }
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