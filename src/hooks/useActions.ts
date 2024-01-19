import {useDispatch} from "react-redux";
import {bindActionCreators} from "redux";
import * as ChatActionCreators from '../store/actionCreators/chat'

export const useActions = () => {
    const dispatch = useDispatch()
    return bindActionCreators(ChatActionCreators, dispatch)
}