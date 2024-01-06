

export interface Message {
    id? : number,
    text : string,
    createdOn : Array<string>,
    editedOn : Array<string>,
    sender : User
    repliedMessage : Message,
    messages : Array<Message>
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
    name? : string,
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


