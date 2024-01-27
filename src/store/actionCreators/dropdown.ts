import {DropdownReducerActionTypes} from "../reducers/dropdownReducer";
import {Dispatch} from "redux";


interface SetIsFileDropdownActive {
    type : DropdownReducerActionTypes.SET_IS_FILE_DROPDOWN_ACTIVE
    payload : boolean
}

export const setIsFileDropdownActive =  (isFileDropdownActive : boolean) => {
    return async (dispatch : Dispatch<DropdownAction>) => {
        dispatch({type : DropdownReducerActionTypes.SET_IS_FILE_DROPDOWN_ACTIVE, payload : isFileDropdownActive})
    }
}

export type DropdownAction =  SetIsFileDropdownActive


