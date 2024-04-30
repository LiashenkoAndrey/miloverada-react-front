import {AppUser, ForumUser} from "../API/services/forum/ForumInterfaces";
import {AdminMetadata} from "../API/services/UserService";


export interface UserState {
    appUser : AppUser | null
    adminMetadata? : AdminMetadata | null
    forumUser : ForumUser | null
}

export enum UserActionTypes {
    SET_USER = "SET_USER",
    SET_ADMIN_METADATA = "SET_ADMIN_METADATA",
    SET_FORUM_USER = "SET_FORUM_USER"
}

interface SetUser {
    type: UserActionTypes.SET_USER
    payload: AppUser
}

interface SetForumUser {
    type: UserActionTypes.SET_FORUM_USER
    payload: ForumUser
}

interface SetAdminMetadata {
    type: UserActionTypes.SET_ADMIN_METADATA
    payload: AdminMetadata
}

export type UserAction = SetUser | SetAdminMetadata | SetForumUser
