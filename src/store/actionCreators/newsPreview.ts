import {Dispatch} from "redux";
import {NewsPreviewActionTypes} from "../../types/NewsPreview";
import {INews, INewsPreview} from "../../domain/NewsInt";


export const setNewsPreview =  (preview : INewsPreview) => {
    return async (dispatch : Dispatch<NewsPreviewAction>) => {
        dispatch({type : NewsPreviewActionTypes.SET_NEWS_PREVIEW, payload : preview})
    }
}

interface SetNewsPreview {
    type: NewsPreviewActionTypes.SET_NEWS_PREVIEW
    payload: INewsPreview
}

export type NewsPreviewAction = SetNewsPreview