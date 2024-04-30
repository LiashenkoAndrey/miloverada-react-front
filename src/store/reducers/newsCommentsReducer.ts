import {NewsCommentsAction, NewsCommentsActionTypes, NewsCommentsState} from "../../types/NewsComments";


const initState: NewsCommentsState = {
    comments : [],
    replyComment : null
}

export const newCommentsReducer = (state = initState, action: NewsCommentsAction): NewsCommentsState => {
    switch (action.type) {
        case NewsCommentsActionTypes.SET_COMMENTS :
            return {...state, comments: action.payload}
        case NewsCommentsActionTypes.SET_REPLY_COMMENT :
            return {...state, replyComment: action.payload}

        default :
            return state
    }
}