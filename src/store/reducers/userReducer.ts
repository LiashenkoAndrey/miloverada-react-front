import {UserAction, UserActionTypes, UserState} from "../../types/user";

const initState: UserState = {
    appUser : null,
    adminMetadata : null,
    forumUser : null,
    unreadNotificationNumber : 0
}

export const userReducer = (state = initState, action: UserAction): UserState => {
    switch (action.type) {
        case UserActionTypes.SET_USER :
            return {...state, appUser: action.payload}
        case UserActionTypes.SET_ADMIN_METADATA :
            return {...state, adminMetadata : action.payload}
        case UserActionTypes.SET_FORUM_USER :
            return {...state, forumUser : action.payload}
        case UserActionTypes.SET_UNREAD_NOTIFICATION_NUMBER :
            return {...state, unreadNotificationNumber : action.payload}
        default :
            return state
    }
}