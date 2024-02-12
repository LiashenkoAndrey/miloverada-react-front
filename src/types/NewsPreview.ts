import {INews} from "../domain/NewsInt";


export interface NewsPreviewState {
    preview : INews
}

export enum NewsPreviewActionTypes {
    SET_NEWS_PREVIEW = "SET_NEWS_PREVIEW"
}

