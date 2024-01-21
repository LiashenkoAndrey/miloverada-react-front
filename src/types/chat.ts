import {Message} from "../API/services/forum/ForumInterfaces";

export interface ChatState {
    messages: Message[]
    chatId: number
    hasPreviousMessages: boolean
    hasNextMessages: boolean
    isScrolling : boolean
}

export enum ChatActionTypes {
    SET_MESSAGES = "SET_MESSAGES",
    FETCH_PREVIOUS_MESSAGES = "FETCH_PREVIOUS_MESSAGES",
    FETCH_NEXT_MESSAGES = "FETCH_NEXT_MESSAGES",
    SET_CHAT_ID = "SET_CHAT_ID",
    SET_HAS_PREVIOUS_MESSAGES = "SET_HAS_PREVIOUS_MESSAGES",
    SET_HAS_NEXT_MESSAGES = "SET_HAS_NEXT_MESSAGES",
    SET_IS_SCROLLING = "SET_IS_SCROLLING"
}

interface SetIsScrollingAction {
    type: ChatActionTypes.SET_IS_SCROLLING
    payload: boolean
}

interface SetMessagesAction {
    type: ChatActionTypes.SET_MESSAGES
    payload: Message[]
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
    | SetIsScrollingAction