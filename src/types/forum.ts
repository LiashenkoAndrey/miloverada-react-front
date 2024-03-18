import {IChatWithMeta} from "../API/services/forum/ForumInterfaces";
import {IPost} from "../API/services/forum/PostService";
import {Modes} from "../components/forum/ChatsList/ChatsList";


export interface ForumState {
    chats : IChatWithMeta[],
    posts : IPost[]
    contentMode : Modes | null
}

export enum ForumActionTypes {
    SET_POSTS = "SET_POSTS",
    SET_CHATS = "SET_CHATS",
    SET_CONTENT_MODE = "SET_CONTENT_MODE"
}

interface SetChats {
    type: ForumActionTypes.SET_CHATS
    payload: IChatWithMeta[]
}

interface SetContentMode {
    type: ForumActionTypes.SET_CONTENT_MODE
    payload: Modes
}

interface SetPosts {
    type: ForumActionTypes.SET_POSTS
    payload: IPost[]
}

export type ForumAction = SetChats | SetPosts | SetContentMode