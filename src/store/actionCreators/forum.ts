import {IChatWithMeta} from "../../API/services/forum/ForumInterfaces";
import {Dispatch} from "redux";
import {ForumAction, ForumActionTypes} from "../../types/forum";
import {IPost} from "../../API/services/forum/PostService";
import {Modes} from "../../components/forum/ChatsList/ChatsList";


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

export const setContentMode =  (mode : Modes) => {
    return async (dispatch : Dispatch<ForumAction>) => {
        dispatch({type : ForumActionTypes.SET_CONTENT_MODE, payload : mode})
    }
}