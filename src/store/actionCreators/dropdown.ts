import {DropdownReducerActionTypes} from "../reducers/dropdownReducer";
import {Dispatch} from "redux";
import {DropdownAction} from "../../types/dropdown";




export const setIsFileDropdownActive =  (isFileDropdownActive : boolean) => {
    return async (dispatch : Dispatch<DropdownAction>) => {
        dispatch({type : DropdownReducerActionTypes.SET_IS_FILE_DROPDOWN_ACTIVE, payload : isFileDropdownActive})
    }
}
