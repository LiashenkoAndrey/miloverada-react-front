import {Dispatch} from "redux";
import {NewsCommentsAction, NewsCommentsActionTypes} from "../../types/NewsComments";
import {INewsComment} from "../../API/services/NewsCommentService";


export const setNewsComments =  (preview : INewsComment[]) => {
    return async (dispatch : Dispatch<NewsCommentsAction>) => {
        dispatch({type : NewsCommentsActionTypes.SET_COMMENTS, payload : preview})
    }
}

export const setReplyComment =  (preview : INewsComment) => {
    return async (dispatch : Dispatch<NewsCommentsAction>) => {
        dispatch({type : NewsCommentsActionTypes.SET_REPLY_COMMENT, payload : preview})
    }
}