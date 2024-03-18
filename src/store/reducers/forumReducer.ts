import {ForumAction, ForumActionTypes, ForumState} from "../../types/forum";
import {Modes} from "../../components/forum/ChatsList/ChatsList";

const initState : ForumState = {
    chats : [],
    posts : [],
    contentMode : null
}

export const forumReducer = (state = initState, action: ForumAction): ForumState => {
    switch (action.type) {
        case ForumActionTypes.SET_CHATS :
            return {...state, chats: action.payload}
        case ForumActionTypes.SET_POSTS :
            return {...state, posts: action.payload}
        case ForumActionTypes.SET_CONTENT_MODE :
            return {...state, contentMode: action.payload}
        default :
            return state
    }
}