import {NewsPreviewActionTypes, NewsPreviewState} from "../../types/NewsPreview";
import {NewsPreviewAction} from "../actionCreators/newsPreview";

const initState: NewsPreviewState = {
    preview : {views: 0, images: []}
}

export const newsPreviewReducer = (state = initState, action: NewsPreviewAction): NewsPreviewState => {
    switch (action.type) {
        case NewsPreviewActionTypes.SET_NEWS_PREVIEW :
            return {...state, preview: action.payload}

        default :
            return state
    }
}