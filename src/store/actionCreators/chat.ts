import {Dispatch} from "redux";
import {ChatAction, ChatActionTypes} from "../../types/chat";
import {Message} from "../../API/services/forum/ForumInterfaces";


export const setMsg =  (list : Message[]) => {
    return async (dispatch : Dispatch<ChatAction>) => {
        dispatch({type : ChatActionTypes.SET_MESSAGES, payload : list})
    }
}