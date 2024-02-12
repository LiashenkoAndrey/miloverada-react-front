import {Dispatch} from "redux";
import {NewsPreviewActionTypes} from "../../types/NewsPreview";
import {INews} from "../../domain/NewsInt";


export const setNewsPreview =  (preview : INews) => {
    return async (dispatch : Dispatch<NewsPreviewAction>) => {
        dispatch({type : NewsPreviewActionTypes.SET_NEWS_PREVIEW, payload : preview})
    }
}

interface SetNewsPreview {
    type: NewsPreviewActionTypes.SET_NEWS_PREVIEW
    payload: INews
}

export type NewsPreviewAction = SetNewsPreview