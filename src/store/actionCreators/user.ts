import {Dispatch} from "redux";
import {AppUser, ForumUser} from "../../API/services/forum/ForumInterfaces";
import {AdminMetadata} from "../../API/services/main/UserService";
import {UserAction, UserActionTypes} from "../../types/user";




export const setUser =  (user : AppUser) => {
    return async (dispatch : Dispatch<UserAction>) => {
        dispatch({type : UserActionTypes.SET_USER, payload : user})
    }
}

export const setAdminMetadata =  (metadata : AdminMetadata) => {
    return async (dispatch : Dispatch<UserAction>) => {
        dispatch({type : UserActionTypes.SET_ADMIN_METADATA, payload : metadata})
    }
}

export const setNotificationNumber =  (number : number) => {
    return async (dispatch : Dispatch<UserAction>) => {
        dispatch({type : UserActionTypes.SET_UNREAD_NOTIFICATION_NUMBER, payload : number})
    }
}

export const setForumUser =  (forumUser : ForumUser) => {
    return async (dispatch : Dispatch<UserAction>) => {
        dispatch({type : UserActionTypes.SET_FORUM_USER, payload : forumUser})
    }
}
