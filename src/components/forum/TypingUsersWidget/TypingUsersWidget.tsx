import React, {FC} from 'react';
import {Flex} from "antd";
import classes from "./TypingUsersWidget.module.css";
import {ForumUserDto, TypingUser} from "../../../API/services/forum/ForumInterfaces";
import {IMessage} from "@stomp/stompjs/src/i-message";
import {useSubscription} from "react-stomp-hooks";
import {useTypedSelector} from "../../../hooks/useTypedSelector";

interface TypingUsersWidgetProps {
    removeTypingUser: (userId: string | undefined) => void
    addTypingUser : (userId : string, typingUser : TypingUser) => void
    typingUsers: Map<string, TypingUser>
}

const TypingUsersWidget: FC<TypingUsersWidgetProps> = ({
                                                           removeTypingUser,
                                                           addTypingUser,
    typingUsers

                                                       }) => {
    const {chatId} = useTypedSelector(state => state.chat)

    const onUsersStartTyping = (message: IMessage) => {
        const userDto: ForumUserDto = JSON.parse(message.body)
        addTypingUser(userDto.id, {firstName: userDto.name, id: userDto.id})
    }

    const onUsersStopTyping = (message: IMessage) => {
        const data : ForumUserDto = JSON.parse( message.body)
        removeTypingUser(data.id)
    }

    useSubscription(`/chat/` + chatId + "/userStopTyping", onUsersStopTyping)
    useSubscription(`/chat/` + chatId + "/typingUsers", onUsersStartTyping)



    return (
        <Flex justify={"space-between"}
              style={{position: "absolute", opacity : typingUsers.size === 0 ? '0' : '100'}}
              className={classes.typingUsersWrapper}
        >
            <Flex >
                <div className={classes.typing}>
                    <div className={classes.dot}></div>
                    <div className={classes.dot}></div>
                    <div className={classes.dot}></div>
                    <Flex className={classes.typingUsersList}>
                        {typingUsers.size > 0 &&
                            Array.from(typingUsers.values()).map((user) =>
                                <span key={"typingUser-" + user.id}
                                      className={classes.typingUserName}>{user.firstName} пише...</span>
                            )
                        }
                    </Flex>
                </div>
            </Flex>
        </Flex>
    );
};

export default TypingUsersWidget;