import {Dispatch} from "redux";
import {ChatInputActionTypes} from "../reducers/chatInputReducer";
import {ChatInputAction} from "../../types/chatInput";


export const setFilesList =  (filesList : File[]) => {
    return async (dispatch : Dispatch<ChatInputAction>) => {
        dispatch({type : ChatInputActionTypes.SET_FILES_LIST, payload : filesList})
    }
}
