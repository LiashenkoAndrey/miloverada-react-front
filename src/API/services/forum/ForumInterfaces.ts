import {MessageFile, MessageFileDto} from "./MessageDto";


export interface Message {
    id : number,
    text : string,
    createdOn : string[],
    editedOn : string[],
    sender : User
    repliedMessage : Message,
    messages : Array<Message>
    imagesList : MessageImage[]
    filesList : MessageFile[]
    fileDtoList : MessageFileDto[]
    forwardedMessage : Message
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

export interface PrivateChat {
    chat_id : number
    user1 : User
    user2 : User
}

export interface IChat {
    id : number,
    name : string,
    description : string,
    picture : string,
    owner : ForumUser,
    totalMessagesAmount : number
    totalMembersAmount : number
    createdOn : string[]
}


export interface IChatWithMeta {
    chat : IChat
    chatMetadata : ChatMetadata
}

export interface MessageImageDto {
    base64Image : string
}

export interface ChatMetadata {
    last_read_message_id : number
    unread_messages_count : number
    is_member : boolean
}

export interface LastReadMessageDto {
    chatId : number
    userId : string
    messageId : number
}


export interface NewChat {
    name : string,
    description : string,
    picture? : string,
    ownerId : string,
    topicId : number
}

export interface User {
    registeredOn? : string[]
    id : string,
    firstName : string,
    lastName : string,
    avatar : string
}

export interface TypingUser {
    id : string,
    firstName : string,
}

export interface NewForumUserDto {
    nickname : string,
    avatar : string
    aboutMe : string
}

export interface ForumUser {
    aboutMe : string,
    id : number,
    appUserId : string,
    registeredOn : string,
    nickname : string,
    avatar : string
    isVerified : boolean
}

export interface AppUser {
    id? : string,
    firstName? : string,
    lastName? : string,
    email? : string
    avatarBase64Image? : string
    avatarContentType? : string
    avatarUrl? : string
    registeredOn : string
}

export interface AppUserDto {
    id : string,
    firstName : string,
    lastName : string,
    avatarBase64Image? : string
    avatarUrl? : string
}

export interface NewUserDto {
    id? : string,
    firstName? : string,
    lastName? : string,
    avatar? : string
    email? : string
    avatarBase64Image? : string
    avatarContentType? : string
    avatarUrl? : string
}

export interface Topic {
    id? : number,
    name? : string,
    description? : string,
    chats? : Array<IChat>
}


export interface ITopic {
    id : number,
    name : string,
    description : string,
    chats : IChat[]
}

