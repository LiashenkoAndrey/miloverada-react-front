import {IChat, Message, PrivateChat} from "../API/services/forum/ForumInterfaces";

export interface ChatState {
    messages: Message[]
    chatId: number,
    chatInfo: IChat | null
    isSelectionEnabled : boolean,
    isSelectChatToForwardMessageModalActive : boolean
    selectedMessages : Message[]
    privateChatInfo : PrivateChat | null
    hasPreviousMessages: boolean
    hasNextMessages: boolean
    unreadMessagesCount : number
    lastReadMessageId : number
}

export enum ChatActionTypes {
    SET_MESSAGES = "SET_MESSAGES",
    SET_CHAT_INFO = "SET_CHAT_INFO",
    SET_PRIVATE_CHAT_INFO = "SET_PRIVATE_CHAT_INFO",
    SET_IS_SELECTION_ENABLED = "SET_IS_SELECTION_ENABLED" ,
    SET_SELECTED_MESSAGES = "SET_SELECTED_MESSAGES" ,
    SET_IS_SELECT_CHAT_TO_FORWARD_MESSAGE_MODAL_ACTIVE = "SET_IS_SELECT_CHAT_TO_FORWARD_MESSAGE_MODAL_ACTIVE",
    FETCH_PREVIOUS_MESSAGES = "FETCH_PREVIOUS_MESSAGES",
    FETCH_NEXT_MESSAGES = "FETCH_NEXT_MESSAGES",
    SET_CHAT_ID = "SET_CHAT_ID",
    SET_HAS_PREVIOUS_MESSAGES = "SET_HAS_PREVIOUS_MESSAGES",
    SET_HAS_NEXT_MESSAGES = "SET_HAS_NEXT_MESSAGES",
    SET_IS_UNREAD_MESSAGES_COUNT = "SET_IS_UNREAD_MESSAGES_COUNT",
    SET_LAST_READ_MESSAGE_ID = "SET_LAST_READ_MESSAGE_ID"
}


interface SetMessagesAction {
    type: ChatActionTypes.SET_MESSAGES
    payload: Message[]
}

interface SetIsSelectChatToForwardMessageModalActive {
    type: ChatActionTypes.SET_IS_SELECT_CHAT_TO_FORWARD_MESSAGE_MODAL_ACTIVE
    payload: boolean
}

interface SetSelectedMessagesAction {
    type: ChatActionTypes.SET_SELECTED_MESSAGES
    payload: Message[]
}

interface SetIsSelectionEnabledAction {
    type: ChatActionTypes.SET_IS_SELECTION_ENABLED
    payload: boolean
}


interface SetPrivateChatInfoAction {
    type: ChatActionTypes.SET_PRIVATE_CHAT_INFO
    payload: PrivateChat
}

interface SetChatInfoAction {
    type: ChatActionTypes.SET_CHAT_INFO
    payload: IChat
}

interface SetUnreadMessagesCountAction {
    type: ChatActionTypes.SET_IS_UNREAD_MESSAGES_COUNT
    payload: number
}

interface SetLastReadMessageIdAction {
    type: ChatActionTypes.SET_LAST_READ_MESSAGE_ID
    payload: number
}

interface SetChatIdAction {
    type: ChatActionTypes.SET_CHAT_ID
    payload: number
}


interface FetchPreviousMessagesAction {
    type: ChatActionTypes.FETCH_PREVIOUS_MESSAGES
    payload: Message[]
}

interface FetchNextMessagesAction {
    type: ChatActionTypes.FETCH_NEXT_MESSAGES
    payload: Message[]
}

interface SetHasPreviousMessages {
    type: ChatActionTypes.SET_HAS_PREVIOUS_MESSAGES
    payload: boolean
}

interface SetHasHextMessages {
    type: ChatActionTypes.SET_HAS_NEXT_MESSAGES
    payload: boolean
}


export type ChatAction =
    SetMessagesAction
    | FetchPreviousMessagesAction
    | SetChatIdAction
    | SetHasPreviousMessages
    | SetHasHextMessages
    | FetchNextMessagesAction
    | SetUnreadMessagesCountAction
    | SetLastReadMessageIdAction
    | SetChatInfoAction
    | SetPrivateChatInfoAction
    | SetIsSelectionEnabledAction
    | SetSelectedMessagesAction
    | SetIsSelectChatToForwardMessageModalActive
