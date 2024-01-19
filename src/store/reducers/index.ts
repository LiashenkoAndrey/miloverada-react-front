import {combineReducers} from "redux";
import {chatReducer} from "./chatReducer";


export const rootReducer = combineReducers({
    chat : chatReducer,
})

export type RootState = ReturnType<typeof rootReducer>