import {Message} from "../API/services/forum/ForumInterfaces";

export interface ChatState {
    messages : Message[]
}

export enum ChatActionTypes {
    SET_MESSAGES = "SET_MESSAGES"
}

interface SetMessagesAction {
    type : ChatActionTypes.SET_MESSAGES
    payload : Message[]
}

export type ChatAction = SetMessagesAction