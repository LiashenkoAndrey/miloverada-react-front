import {ChatAction, ChatActionTypes, ChatState} from "../../types/chat";


const initState : ChatState = {
    messages: [],
    chatId : -1,
    hasPreviousMessages : true
}



export const chatReducer = (state = initState, action : ChatAction) : ChatState => {
    switch (action.type) {
        case ChatActionTypes.SET_MESSAGES :
            return {...state, messages : action.payload}
        case ChatActionTypes.FETCH_PREVIOUS_MESSAGES:
            return {...state, messages: action.payload}
        case ChatActionTypes.SET_CHAT_ID:
            return {...state, chatId : action.payload}
        case ChatActionTypes.SET_HAS_PREVIOUS_MESSAGES :
            return {...state, hasPreviousMessages : action.payload}
        default :
            return state
    }
}