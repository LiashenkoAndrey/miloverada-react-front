import {useDispatch} from "react-redux";
import {bindActionCreators} from "redux";
import * as ChatActionCreators from '../store/actionCreators/chat'
import * as ChatInputActionCreators from '../store/actionCreators/chatInput'
import * as DropdownActionCreators from '../store/actionCreators/dropdown'
import * as NewsPreviewActionCreators from '../store/actionCreators/newsPreview'

export const useActions = () => {
    const dispatch = useDispatch()
    return bindActionCreators(Object.assign({}, ChatActionCreators, ChatInputActionCreators, DropdownActionCreators, NewsPreviewActionCreators), dispatch)
}