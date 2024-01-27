import {Dispatch} from "redux";
import {ChatInputActionTypes} from "../reducers/chatInputReducer";


export const setFilesList =  (filesList : File[]) => {
    return async (dispatch : Dispatch<ChatInputAction>) => {
        dispatch({type : ChatInputActionTypes.SET_FILES_LIST, payload : filesList})
    }
}

interface SetFilesList {
    type: ChatInputActionTypes.SET_FILES_LIST
    payload: File[]
}

export type ChatInputAction = SetFilesList