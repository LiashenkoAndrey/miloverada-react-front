import {AppUser, ForumUser} from "../API/services/forum/ForumInterfaces";
import {AdminMetadata} from "../API/services/main/UserService";


export interface UserState {
    appUser : AppUser | null
    adminMetadata? : AdminMetadata | null
    forumUser : ForumUser | null
    unreadNotificationNumber : number
}

export enum UserActionTypes {
    SET_USER = "SET_USER",
    SET_UNREAD_NOTIFICATION_NUMBER = "SET_UNREAD_NOTIFICATION_NUMBER",
    SET_ADMIN_METADATA = "SET_ADMIN_METADATA",
    SET_FORUM_USER = "SET_FORUM_USER"
}

interface SetUser {
    type: UserActionTypes.SET_USER
    payload: AppUser
}

interface SetNotificationNumber {
    type: UserActionTypes.SET_UNREAD_NOTIFICATION_NUMBER
    payload: number
}

interface SetForumUser {
    type: UserActionTypes.SET_FORUM_USER
    payload: ForumUser
}

interface SetAdminMetadata {
    type: UserActionTypes.SET_ADMIN_METADATA
    payload: AdminMetadata
}

export type UserAction = SetUser | SetAdminMetadata | SetForumUser | SetNotificationNumber
