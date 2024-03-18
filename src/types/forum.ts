import {IChatWithMeta} from "../API/services/forum/ForumInterfaces";
import {IPost} from "../API/services/forum/PostService";


export interface ForumState {
    chats : IChatWithMeta[],
    posts : IPost[]
}

export enum ForumActionTypes {
    SET_POSTS = "SET_POSTS",
    SET_CHATS = "SET_CHATS"
}

interface SetChats {
    type: ForumActionTypes.SET_CHATS
    payload: IChatWithMeta[]
}


interface SetPosts {
    type: ForumActionTypes.SET_POSTS
    payload: IPost[]
}

export type ForumAction = SetChats | SetPosts