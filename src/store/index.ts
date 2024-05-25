import {applyMiddleware, legacy_createStore as createStore} from 'redux'
import {thunk} from "redux-thunk";
import {rootReducer} from "./reducers";
import {composeWithDevTools} from "@redux-devtools/extension";

const composedEnhancers = composeWithDevTools(applyMiddleware(thunk))
// @ts-ignore
export const store = createStore(rootReducer, composedEnhancers)
