import {ForumAction, ForumActionTypes, ForumState} from "../../types/forum";

const initState : ForumState = {
    chats : [],
    posts : []
}

export const forumReducer = (state = initState, action: ForumAction): ForumState => {
    switch (action.type) {
        case ForumActionTypes.SET_CHATS :
            return {...state, chats: action.payload}
        case ForumActionTypes.SET_POSTS :
            return {...state, posts: action.payload}
        default :
            return state
    }
}