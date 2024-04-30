import {Dispatch} from "redux";
import {ChatAction, ChatActionTypes} from "../../types/chat";
import {IChat, Message, PrivateChat} from "../../API/services/forum/ForumInterfaces";
import {getNextMessagesOfChat, getPreviousMessagesOfChat} from "../../API/services/forum/MessageService";
import {MESSAGE_LOAD_PORTION_SIZE} from "../../Constants";


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


export const setChatInfo =  (chatInfo : IChat) => {
    return async (dispatch : Dispatch<ChatAction>) => {
        dispatch({type : ChatActionTypes.SET_CHAT_INFO, payload : chatInfo})
    }
}

export const setIsSelectionEnabled =  (isSelectionEnabled : boolean) => {
    return async (dispatch : Dispatch<ChatAction>) => {
        dispatch({type : ChatActionTypes.SET_IS_SELECTION_ENABLED, payload : isSelectionEnabled})
    }
}

export const setIsSelectChatToForwardMessageModalActive =  (isActive : boolean) => {
    return async (dispatch : Dispatch<ChatAction>) => {
        dispatch({type : ChatActionTypes.SET_IS_SELECT_CHAT_TO_FORWARD_MESSAGE_MODAL_ACTIVE, payload : isActive})
    }
}


export const setSelectedMessages =  (messages : Message[]) => {
    return async (dispatch : Dispatch<ChatAction>) => {
        dispatch({type : ChatActionTypes.SET_SELECTED_MESSAGES, payload : messages})
    }
}

export const setPrivateChatInfo =  (privateChatInfo : PrivateChat) => {
    return async (dispatch : Dispatch<ChatAction>) => {
        dispatch({type : ChatActionTypes.SET_PRIVATE_CHAT_INFO, payload : privateChatInfo})
    }
}

export const setHasPreviousMessages =  (hasPreviousMessages : boolean) => {
    return async (dispatch : Dispatch<ChatAction>) => {
        dispatch({type : ChatActionTypes.SET_HAS_PREVIOUS_MESSAGES, payload : hasPreviousMessages})
    }
}


export const setHasNextMessages =  (hasNextMessages : boolean) => {
    return async (dispatch : Dispatch<ChatAction>) => {
        dispatch({type : ChatActionTypes.SET_HAS_NEXT_MESSAGES, payload : hasNextMessages})
    }
}


export const setLastReadMessageId =  (lastReadMessageId : number) => {
    return async (dispatch : Dispatch<ChatAction>) => {
        dispatch({type : ChatActionTypes.SET_LAST_READ_MESSAGE_ID, payload : lastReadMessageId})
    }
}

export const setUnreadMessagesCount =  (unreadMessagesCount : number) => {
    return async (dispatch : Dispatch<ChatAction>) => {
        dispatch({type : ChatActionTypes.SET_IS_UNREAD_MESSAGES_COUNT, payload : unreadMessagesCount})
    }
}


export const fetchPreviousMessages = (chatId : number, messages : Message[]) => {
    return async (dispatch : Dispatch<ChatAction>)=> {
        console.log("LOAD PREV", messages)
        const {data, error} = await getPreviousMessagesOfChat(chatId, messages[0].id)
        if (data) {
            console.log("data.length < MESSAGE_LOAD_PORTION_SIZE", data.length < MESSAGE_LOAD_PORTION_SIZE, data.length, MESSAGE_LOAD_PORTION_SIZE)
            if (data.length < MESSAGE_LOAD_PORTION_SIZE) {
                dispatch({type: ChatActionTypes.SET_HAS_PREVIOUS_MESSAGES, payload: false})
            }
            dispatch({type: ChatActionTypes.FETCH_PREVIOUS_MESSAGES, payload: [...data, ...messages]})
        }
        if (error) throw error
    }
}

export const fetchNextMessages = (chatId : number, messages : Message[]) => {
    return async (dispatch : Dispatch<ChatAction>)=> {
        console.log("LOAD NEXT", messages)
        const {data, error} = await getNextMessagesOfChat(chatId, messages[messages.length-1].id)
        if (data) {
            if (data.length < MESSAGE_LOAD_PORTION_SIZE) {
                dispatch({type: ChatActionTypes.SET_HAS_NEXT_MESSAGES, payload: false})
            }
            dispatch({type: ChatActionTypes.FETCH_NEXT_MESSAGES, payload: [...messages, ...data]})
        }
        if (error) throw error
    }
}