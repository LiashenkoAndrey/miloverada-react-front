import {DropdownAction} from "../actionCreators/dropdown";


export enum DropdownReducerActionTypes {
    SET_IS_FILE_DROPDOWN_ACTIVE = "SET_IS_FILE_DROPDOWN_ACTIVE"
}

export interface DropdownState {
    isFileDropdownActive : boolean
}

const initState : DropdownState = {
    isFileDropdownActive : false
}



export const dropdownReducer = (state = initState, action: DropdownAction): DropdownState => {
    switch (action.type) {
        case DropdownReducerActionTypes.SET_IS_FILE_DROPDOWN_ACTIVE :
            return {...state, isFileDropdownActive: action.payload}
        default :
            return state
    }
}