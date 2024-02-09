import {combineReducers} from "redux";
import {chatReducer} from "./chatReducer";
import {chatInputReducer} from "./chatInputReducer";
import {dropdownReducer} from "./dropdownReducer";
import {newsPreviewReducer} from "./newsPreviewReducer";


export const rootReducer = combineReducers({
    chat : chatReducer,
    chatInput : chatInputReducer,
    dropdown : dropdownReducer,
    newsPreview : newsPreviewReducer
})

export type RootState = ReturnType<typeof rootReducer>