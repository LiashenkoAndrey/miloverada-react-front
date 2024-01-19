import {ChatAction, ChatActionTypes, ChatState} from "../../types/chat";
import {Message} from "../../API/services/forum/ForumInterfaces";



const initState : ChatState = {
    messages: []
}



export const chatReducer = (state = initState, action : ChatAction) : ChatState => {
    switch (action.type) {
        case ChatActionTypes.SET_MESSAGES :
            return {messages : action.payload}
        default :
            return state
    }
}