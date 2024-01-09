import {MessageImageDto} from "./ForumInterfaces";


export interface MessageDto {
    chatId : number
    senderId : string,
    text : string,
    imagesDtoList : MessageImageDto[]
    replyToMessageId? : number
}