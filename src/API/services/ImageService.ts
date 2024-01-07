
const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;
const IMAGE_ENDPOINT = apiServerUrl + "/api/upload/image/"
const FORUM_IMAGE_ENDPOINT = apiServerUrl + "/api/forum/upload/image/"

export const getImageUrl = (imageId: string | undefined) => {
    if (imageId === undefined) return "/"
    return IMAGE_ENDPOINT + imageId
}

export const getForumImageUrl = (imageId: string | undefined) => {
    if (imageId === undefined) return "/"
    return FORUM_IMAGE_ENDPOINT + imageId
}
