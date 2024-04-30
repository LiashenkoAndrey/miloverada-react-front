import {Dispatch} from "redux";
import {NewsPreviewActionTypes} from "../../types/NewsPreview";
import {INews} from "../../domain/NewsInt";
import {NewsPreviewAction} from "../../types/newPreview";


export const setNewsPreview =  (preview : INews) => {
    return async (dispatch : Dispatch<NewsPreviewAction>) => {
        dispatch({type : NewsPreviewActionTypes.SET_NEWS_PREVIEW, payload : preview})
    }
}
