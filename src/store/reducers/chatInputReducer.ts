import {ChatInputAction} from "../../types/chatInput";

export interface ChatInputState {
    filesList : File[]
}

export enum ChatInputActionTypes {
    SET_FILES_LIST = "SET_FILES_LIST",
}

const initState: ChatInputState = {
    filesList : []
}

export const chatInputReducer = (state = initState, action: ChatInputAction): ChatInputState => {
    switch (action.type) {
        case ChatInputActionTypes.SET_FILES_LIST :
            return {...state, filesList: action.payload}

        default :
            return state
    }
}