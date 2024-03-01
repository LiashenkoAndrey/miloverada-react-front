import {UserAction, UserActionTypes, UserState} from "../actionCreators/user";

const initState: UserState = {
    appUser : null,
    adminMetadata : null
}

export const userReducer = (state = initState, action: UserAction): UserState => {
    switch (action.type) {
        case UserActionTypes.SET_USER :
            return {...state, appUser: action.payload}
        case UserActionTypes.SET_ADMIN_METADATA :
            return {...state, adminMetadata : action.payload}
        default :
            return state
    }
}