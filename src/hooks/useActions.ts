import {useDispatch} from "react-redux";
import {bindActionCreators} from "redux";
import * as ChatActionCreators from '../store/actionCreators/chat'
import * as ChatInputActionCreators from '../store/actionCreators/chatInput'
import * as DropdownActionCreators from '../store/actionCreators/dropdown'
import * as NewsPreviewActionCreators from '../store/actionCreators/newsPreview'
import * as UserActionCreators from '../store/actionCreators/user'
import * as NewsCommentsActionCreators from '../store/actionCreators/newsComments'
import * as ForumActionCreators from '../store/actionCreators/forum'

export const useActions = () => {
    const dispatch = useDispatch()
    return bindActionCreators(Object.assign(
        {},
        ChatActionCreators,
        ChatInputActionCreators,
        DropdownActionCreators,
        NewsPreviewActionCreators,
        UserActionCreators,
        NewsCommentsActionCreators,
        ForumActionCreators
    ), dispatch)
}