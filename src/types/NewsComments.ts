import {INewsComment} from "../API/services/main/NewsCommentService";


export interface NewsCommentsState {
    comments : INewsComment[]
    replyComment : INewsComment | null
}


export enum NewsCommentsActionTypes {
    SET_COMMENTS = "SET_COMMENTS",
    SET_REPLY_COMMENT = "SET_REPLY_COMMENT"
}




interface SetNewsComments{
    type: NewsCommentsActionTypes.SET_COMMENTS
    payload: INewsComment[]
}

interface SetReplyComment{
    type: NewsCommentsActionTypes.SET_REPLY_COMMENT
    payload: INewsComment
}

export type NewsCommentsAction = SetNewsComments | SetReplyComment