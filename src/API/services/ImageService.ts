
const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;
const GET_IMAGE_ENDPOINT = apiServerUrl + "/api/upload/image/"

export const getImageUrl = (imageId: string | undefined) => {
    if (imageId === undefined) return "/"
    return GET_IMAGE_ENDPOINT + imageId
}
