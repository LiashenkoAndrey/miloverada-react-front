import {combineReducers} from "redux";
import {chatReducer} from "./chatReducer";
import {chatInputReducer} from "./chatInputReducer";
import {dropdownReducer} from "./dropdownReducer";
import {newsPreviewReducer} from "./newsPreviewReducer";
import {userReducer} from "./userReducer";
import {newCommentsReducer} from "./newsCommentsReducer";


export const rootReducer = combineReducers({
    chat : chatReducer,
    chatInput : chatInputReducer,
    dropdown : dropdownReducer,
    newsPreview : newsPreviewReducer,
    user : userReducer,
    newsComments : newCommentsReducer
})

export type RootState = ReturnType<typeof rootReducer>