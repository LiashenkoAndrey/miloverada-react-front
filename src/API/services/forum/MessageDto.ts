import {MessageImageDto} from "./ForumInterfaces";


export interface MessageFile {
    id : number
    message_id : string
    file : File
}
export interface MessageFileDto {
    messageId : number
    name : string
    size : number
    format : string
    mongoId? : string
    isLarge? : boolean
}


export interface MessageFileDtoSmall {
    name : string
    size : number
    format : string
}



export interface File {
    name : string
    size : number
    format : string
    mongoFileId : string
    isLarge : boolean
}
export interface MessageIsSavedPayload {
    messageId : number
}

export interface MessageDto {
    chatId : number
    senderId : string,
    text : string,
    imagesDtoList : MessageImageDto[]
    replyToMessageId? : number
    fileDtoList : MessageFileDtoSmall[]
}