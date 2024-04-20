import {IChatWithMeta, ITopic} from "../API/services/forum/ForumInterfaces";
import {IPost} from "../API/services/forum/PostService";
import {Modes} from "../components/forum/ChatsList/ChatsList";
import {IStory} from "../API/services/forum/StoryService";


export interface ForumState {
    chats : IChatWithMeta[],
    posts : IPost[],
    stories : IStory[],
    topics : ITopic[],
    contentMode : Modes | null
}

export enum ForumActionTypes {
    SET_POSTS = "SET_POSTS",
    SET_CHATS = "SET_CHATS",
    SET_TOPICS = "SET_TOPICS",
    SET_STORIES = "SET_STORIES",
    SET_CONTENT_MODE = "SET_CONTENT_MODE"
}

interface SetChats {
    type: ForumActionTypes.SET_CHATS
    payload: IChatWithMeta[]
}

interface SetStories {
    type: ForumActionTypes.SET_STORIES
    payload: IStory[]
}

interface SetTopics {
    type: ForumActionTypes.SET_TOPICS
    payload: ITopic[]
}

interface SetContentMode {
    type: ForumActionTypes.SET_CONTENT_MODE
    payload: Modes
}

interface SetPosts {
    type: ForumActionTypes.SET_POSTS
    payload: IPost[]
}

export type ForumAction = SetChats | SetPosts | SetContentMode | SetTopics | SetStories