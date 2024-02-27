import {Dispatch} from "redux";
import {AppUser} from "../../API/services/forum/ForumInterfaces";


export interface UserState {
    appUser? : AppUser
}

export enum UserActionTypes {
    SET_USER = "SET_USER"
}

export const setUser =  (user : AppUser) => {
    return async (dispatch : Dispatch<UserAction>) => {
        dispatch({type : UserActionTypes.SET_USER, payload : user})
    }
}

interface SetUser {
    type: UserActionTypes.SET_USER
    payload: AppUser
}

export type UserAction = SetUser

