import {INewsPreview} from "../domain/NewsInt";


export interface NewsPreviewState {
    preview : INewsPreview
}

export enum NewsPreviewActionTypes {
    SET_NEWS_PREVIEW = "SET_NEWS_PREVIEW"
}

