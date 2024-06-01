import {ForumAction, ForumActionTypes, ForumState} from "../../types/forum";

const initState : ForumState = {
    chats : [],
    posts : [],
    topics : [],
    stories : [],
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
        case ForumActionTypes.SET_TOPICS :
            return {...state, topics: action.payload}
        case ForumActionTypes.SET_STORIES :
            return {...state, stories: action.payload}
        default :
            return state
    }
}
