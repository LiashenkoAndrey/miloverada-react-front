import {combineReducers} from "redux";
import {chatReducer} from "./chatReducer";
import {chatInputReducer} from "./chatInputReducer";
import {dropdownReducer} from "./dropdownReducer";


export const rootReducer = combineReducers({
    chat : chatReducer,
    chatInput : chatInputReducer,
    dropdown : dropdownReducer
})

export type RootState = ReturnType<typeof rootReducer>