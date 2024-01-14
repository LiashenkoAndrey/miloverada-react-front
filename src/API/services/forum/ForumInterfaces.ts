

export interface Message {
    id? : number,
    text : string,
    createdOn : string[],
    editedOn : string[],
    sender : User
    repliedMessage : Message,
    messages : Array<Message>
    imagesList : MessageImage[]
}


export interface DeleteMessageDto {
    messageId : number
    chatId : number
}

export interface UpdateMessageDto {
    id : number
    text : string
    chatId : number
}


export interface DeleteMessageImageDto {
    messageId : number
    imageId : string
    chatId : number
}

export interface MessageImage {
    id : string,
    imageId : string,
    hashCode : string,
    message_id : number,
    lastLoaded : string
}

export interface ForumUserDto {
    chatId : number,
    id : string,
    name : string,
}

export interface Chat {
    id : number,
    name : string,
    description : string,
    picture : string,
    owner : User,
    totalMessagesAmount : number
    createdOn : string[]
}


export interface MessageImageDto {
    base64Image : string
}

export interface ChatMetadata {
    last_read_message_id : number
    unread_messages_count : number
}

export interface LastReadMessageDto {
    chatId : number
    userId : string
    messageId : number
}


export interface NewChat {
    name : string,
    description : string,
    picture : string,
    ownerId : string,
    topicId : number
}

export interface User {
    id? : string,
    firstName? : string,
    lastName? : string,
    avatar? : string
}

export interface NewUserDto {
    id? : string,
    firstName? : string,
    lastName? : string,
    avatar? : string
    email? : string
}

export interface Topic {
    id? : number,
    name? : string,
    description? : string,
    chats? : Array<Chat>
}


