

export interface Message {
    id? : number,
    text : string,
    createdOn : Array<string>,
    editedOn : Array<string>,
    sender : User
    repliedMessage : Message,
    messages : Array<Message>
}

export interface Chat {
    id? : number,
    name? : string,
    description? : string,
    picture? : string,
    owner : User
}

export interface User {
    id? : number,
    name? : string,
    avatar? : string
}

export interface Topic {
    id? : number,
    name? : string,
    description? : string,
    chats? : Array<Chat>
}


export interface User {
    id? : number,
    name? : string,
    avatar? : string,
}