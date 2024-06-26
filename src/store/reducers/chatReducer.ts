import {ChatAction, ChatActionTypes, ChatState} from "../../types/chat";


const initState: ChatState = {
    messages: [],
    chatId: -1,
    chatInfo : null,
    isSelectionEnabled : false,
    isSelectChatToForwardMessageModalActive : false,
    selectedMessages : [],
    privateChatInfo : null,
    hasPreviousMessages: true,
    hasNextMessages: false,
    lastReadMessageId : -1,
    unreadMessagesCount : -1
}

export const chatReducer = (state = initState, action: ChatAction): ChatState => {
    switch (action.type) {
        case ChatActionTypes.SET_MESSAGES :
            return {...state, messages: action.payload}
        case ChatActionTypes.FETCH_PREVIOUS_MESSAGES:
            return {...state, messages: action.payload}
        case ChatActionTypes.SET_CHAT_ID:
            return {...state, chatId: action.payload}
        case ChatActionTypes.SET_HAS_PREVIOUS_MESSAGES :
            return {...state, hasPreviousMessages: action.payload}
        case ChatActionTypes.SET_HAS_NEXT_MESSAGES:
            return {...state, hasNextMessages: action.payload}
        case ChatActionTypes.FETCH_NEXT_MESSAGES:
            return {...state, messages: action.payload}
        case ChatActionTypes.SET_LAST_READ_MESSAGE_ID:
            return {...state, lastReadMessageId: action.payload}
        case ChatActionTypes.SET_IS_UNREAD_MESSAGES_COUNT:
            return {...state, unreadMessagesCount: action.payload}
        case ChatActionTypes.SET_CHAT_INFO:
            return {...state, chatInfo: action.payload}
        case ChatActionTypes.SET_PRIVATE_CHAT_INFO:
            return {...state, privateChatInfo: action.payload}
        case ChatActionTypes.SET_IS_SELECTION_ENABLED:
            return {...state, isSelectionEnabled: action.payload}
        case ChatActionTypes.SET_SELECTED_MESSAGES:
            return {...state, selectedMessages: action.payload}
        case ChatActionTypes.SET_IS_SELECT_CHAT_TO_FORWARD_MESSAGE_MODAL_ACTIVE:
            return {...state, isSelectChatToForwardMessageModalActive: action.payload}
        default :
            return state
    }
}