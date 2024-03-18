import {Dispatch} from "redux";
import {AppUser} from "../../API/services/forum/ForumInterfaces";
import {AdminMetadata} from "../../API/services/UserService";
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

