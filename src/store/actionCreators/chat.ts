import {Dispatch} from "redux";
import {ChatAction, ChatActionTypes} from "../../types/chat";
import {Message} from "../../API/services/forum/ForumInterfaces";
import {getPreviousMessagesOfChat} from "../../API/services/forum/MessageService";


export const setMsg =  (list : Message[]) => {
    return async (dispatch : Dispatch<ChatAction>) => {
        dispatch({type : ChatActionTypes.SET_MESSAGES, payload : list})
    }
}

export const setChatId =  (chatId : number) => {
    return async (dispatch : Dispatch<ChatAction>) => {
        dispatch({type : ChatActionTypes.SET_CHAT_ID, payload : chatId})
    }
}


export const setHasPreviousMessages =  (hasPreviousMessages : boolean) => {
    return async (dispatch : Dispatch<ChatAction>) => {
        dispatch({type : ChatActionTypes.SET_HAS_PREVIOUS_MESSAGES, payload : hasPreviousMessages})
    }
}

export const fetchPreviousMessages = (chatId : number, messages : Message[]) => {
    return async (dispatch : Dispatch<ChatAction>)=> {
        console.log("LOAD PREV", messages)
        const {data, error} = await getPreviousMessagesOfChat(chatId, messages[0].id)
        if (data) {
            if (data.length === 0) {
                dispatch({type: ChatActionTypes.SET_HAS_PREVIOUS_MESSAGES, payload: false})
            }
            dispatch({type: ChatActionTypes.FETCH_PREVIOUS_MESSAGES, payload: [...data, ...messages]})
        }
        if (error) throw error
    }
}