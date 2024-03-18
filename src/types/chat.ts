import {IChat, Message} from "../API/services/forum/ForumInterfaces";

export interface ChatState {
    messages: Message[]
    chatId: number,
    chatInfo: IChat | null
    hasPreviousMessages: boolean
    hasNextMessages: boolean
    unreadMessagesCount : number
    lastReadMessageId : number
}

export enum ChatActionTypes {
    SET_MESSAGES = "SET_MESSAGES",
    SET_CHAT_INFO = "SET_CHAT_INFO",
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
