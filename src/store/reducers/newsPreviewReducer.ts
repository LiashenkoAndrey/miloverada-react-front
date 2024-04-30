import {NewsPreviewActionTypes, NewsPreviewState} from "../../types/NewsPreview";
import {NewsPreviewAction} from "../../types/newPreview";

const initState: NewsPreviewState = {
    preview : {views: 0, images: [], commentsAmount :1}
}

export const newsPreviewReducer = (state = initState, action: NewsPreviewAction): NewsPreviewState => {
    switch (action.type) {
        case NewsPreviewActionTypes.SET_NEWS_PREVIEW :
            return {...state, preview: action.payload}

        default :
            return state
    }
}