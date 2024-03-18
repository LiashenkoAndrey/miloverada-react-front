import {IChatWithMeta} from "../../API/services/forum/ForumInterfaces";
import {Dispatch} from "redux";
import {ForumAction, ForumActionTypes} from "../../types/forum";
import {IPost} from "../../API/services/forum/PostService";


export const setChats =  (chats : IChatWithMeta[]) => {
    return async (dispatch : Dispatch<ForumAction>) => {
        dispatch({type : ForumActionTypes.SET_CHATS, payload : chats})
    }
}

export const setPosts =  (posts : IPost[]) => {
    return async (dispatch : Dispatch<ForumAction>) => {
        dispatch({type : ForumActionTypes.SET_POSTS, payload : posts})
    }
}