import {ChatInputActionTypes} from "../store/reducers/chatInputReducer";


interface SetFilesList {
    type: ChatInputActionTypes.SET_FILES_LIST
    payload: File[]
}

export type ChatInputAction = SetFilesList