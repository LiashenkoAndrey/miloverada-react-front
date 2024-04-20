import {IChatWithMeta, ITopic} from "../../API/services/forum/ForumInterfaces";
import {Dispatch} from "redux";
import {ForumAction, ForumActionTypes} from "../../types/forum";
import {IPost} from "../../API/services/forum/PostService";
import {Modes} from "../../components/forum/ChatsList/ChatsList";
import {IStory} from "../../API/services/forum/StoryService";


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

export const setStories =  (stories : IStory[]) => {
    return async (dispatch : Dispatch<ForumAction>) => {
        dispatch({type : ForumActionTypes.SET_STORIES, payload : stories})
    }
}


export const setTopics =  (topics : ITopic[]) => {
    return async (dispatch : Dispatch<ForumAction>) => {
        dispatch({type : ForumActionTypes.SET_TOPICS, payload : topics})
    }
}

export const setContentMode =  (mode : Modes) => {
    return async (dispatch : Dispatch<ForumAction>) => {
        dispatch({type : ForumActionTypes.SET_CONTENT_MODE, payload : mode})
    }
}