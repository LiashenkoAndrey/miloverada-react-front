import {Dispatch} from "redux";
import {AppUser} from "../../API/services/forum/ForumInterfaces";
import {AdminMetadata} from "../../API/services/UserService";


export interface UserState {
    appUser : AppUser | null
    adminMetadata? : AdminMetadata | null
}

export enum UserActionTypes {
    SET_USER = "SET_USER",
    SET_ADMIN_METADATA = "SET_ADMIN_METADATA"
}

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

interface SetUser {
    type: UserActionTypes.SET_USER
    payload: AppUser
}

interface SetAdminMetadata {
    type: UserActionTypes.SET_ADMIN_METADATA
    payload: AdminMetadata
}

export type UserAction = SetUser | SetAdminMetadata

