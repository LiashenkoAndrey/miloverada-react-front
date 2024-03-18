import {NewsPreviewActionTypes} from "./NewsPreview";
import {INews} from "../domain/NewsInt";


interface SetNewsPreview {
    type: NewsPreviewActionTypes.SET_NEWS_PREVIEW
    payload: INews
}

export type NewsPreviewAction = SetNewsPreview