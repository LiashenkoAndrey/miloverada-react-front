import {UserAction, UserActionTypes, UserState} from "../actionCreators/user";

const initState: UserState = {
}

export const userReducer = (state = initState, action: UserAction): UserState => {
    switch (action.type) {
        case UserActionTypes.SET_USER :
            return {...state, appUser: action.payload}

        default :
            return state
    }
}