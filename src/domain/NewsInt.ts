import {NewsType} from "../API/services/NewsService";

export interface INews {
    id?: number,
    description? : string,
    dateOfPublication? : string,
    main_text? : string,
    newsType? : NewsType
    views : number
    images? : INewsImage[]
}

export interface INewsDto {
    id?: number,
    description? : string,
    dateOfPublication? : string,
    newsType? : NewsType
    views : number
    images? : INewsImage[]
}

export interface INewsPreview extends INews {
    previewImages : string[]
}

export interface INewsImage {
    id : number
    newsId : number
    mongoImageId : string
}

