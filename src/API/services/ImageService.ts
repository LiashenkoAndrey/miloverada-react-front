
const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;
const IMAGE_ENDPOINT = apiServerUrl + "/api/download/image/"
const IMAGE_V2_ENDPOINT = apiServerUrl + "/api/download/v2/image/"
const DOCUMENT_ENDPOINT = apiServerUrl + "/api/download/file/"
const FORUM_IMAGE_ENDPOINT = apiServerUrl + "/api/forum/upload/image/"

export const getImageUrl = (imageId: string | undefined) => {
    if (imageId === undefined) return "/"
    return IMAGE_ENDPOINT + imageId
}

export const getImageV2Url = (imageId: string | undefined) => {
    if (imageId === undefined) return "/"
    return IMAGE_V2_ENDPOINT + imageId
}

export const getDocumentUrl = (documentUrl: string | undefined) => {
    if (documentUrl === undefined) return "/"
    return DOCUMENT_ENDPOINT + documentUrl
}

export const getForumImageUrl = (imageId: string | undefined) => {
    if (imageId === undefined) return "/"
    return FORUM_IMAGE_ENDPOINT + imageId
}


export const imageToDto = (fileList: string[]) => {
    return fileList.map((file) => {
            return {
                base64Image: file
            }
        }
    )
}