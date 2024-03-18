import {DropdownReducerActionTypes} from "../store/reducers/dropdownReducer";


interface SetIsFileDropdownActive {
    type : DropdownReducerActionTypes.SET_IS_FILE_DROPDOWN_ACTIVE
    payload : boolean
}

export type DropdownAction =  SetIsFileDropdownActive


