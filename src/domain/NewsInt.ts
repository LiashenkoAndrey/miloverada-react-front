import {NewsType} from "../API/services/main/NewsService";

export interface INews {
    id?: number,
    description? : string,
    dateOfPublication? : string,
    main_text? : string,
    image_id? : string
    newsType? : NewsType
    views : number
    images? : INewsImage[]
    commentsAmount : number
}

export interface IImage {
    fileName : string
    base64Image : string
}

export interface INewsDto {
    id?: number,
    description? : string,
    dateOfPublication? : string,
    newsType? : NewsType
    image_id? : string
    views : number
    images : INewsImage[]
    commentsAmount : number
}



export interface INewsImage {
    id? : number
    newsId? : number
    mongoImageId : string
    fileName : string
}

