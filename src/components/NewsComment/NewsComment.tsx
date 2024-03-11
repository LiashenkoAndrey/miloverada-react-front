import React, {FC, memo, useContext, useState} from 'react';
import {deleteNewsCommentById, INewsComment} from "../../API/services/NewsCommentService";
import classes from './NewsComment.module.css'
import {Button, Flex, notification, Popconfirm} from "antd";
import {useActions} from "../../hooks/useActions";
import NewsCommenter from "./NewsCommenter/NewsCommenter";
import {useAuth0} from "@auth0/auth0-react";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {AuthContext} from "../../context/AuthContext";
import {useTypedSelector} from "../../hooks/useTypedSelector";

interface NewsCommentProps {
    comment : INewsComment
    isReply : boolean
}

const NewsComment: FC<NewsCommentProps> = ({comment, isReply}) => {
    const {setReplyComment, setNewsComments} = useActions()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const {isAuthenticated, user} = useAuth0()
    const {jwt} = useContext(AuthContext)
    const {comments} = useTypedSelector(state => state.newsComments)

    const onReply = () => {
        setReplyComment(comment)
        const elem = document.getElementById("commentTextArea")
        if (elem) {
            elem.scrollIntoView({inline: "center", block : "center", behavior : "smooth"})
        }
    }

    function formatDate() {
        const date = new Date(comment.createdOn).toLocaleString();
        return date.substring(0, date.length - 6) + " " + date.substring(date.length - 2, date.length)
    }

    const onDelete = async () => {
        if (jwt) {
            setIsLoading(true)
            const {data, error} = await deleteNewsCommentById(comment.id, jwt)

            setIsLoading(false)
            if (data) {
                const copy : INewsComment[] = [...comments]
                if (comment.newsId === null) {
                    const elem = copy.find((c) => {
                        const e = c.replies.find((r) => r.id === data)
                        if (e) {
                            return e;
                        }
                        return null;
                    })
                    if (elem) {
                        elem.replies = elem.replies.filter((e) => e.id !== data)
                        setNewsComments([...copy])
                    }

                } else {
                    const res = comments.filter((c) => c.id !== data)
                    setNewsComments(res)
                }
            }
            if (error) notification.error({message : "error"})
        } else notification.warning({message: "not auth"})
    }
    const [isNotShowAllReplies, setIsNotShowAllReplies ] = useState<boolean>( true)
    return (
        <Flex vertical gap={5} id={"commentId-" + comment.id} className={[classes.Wrapper, classes.reply].join(' ')}>
            <Flex vertical gap={5} className={classes.Wrapper2}>
                <Flex gap={5} justify={"space-between"} className={classes.nameAndTimeWrapper}>
                    <NewsCommenter author={comment.author}/>
                    <Flex vertical gap={5} className={classes.dateAndReplyBtnWrapper}>
                        <span className={classes.dateOfPublication}>{formatDate()}</span>
                        <Flex gap={5} style={{alignSelf: "end", height: ((isAuthenticated && user?.sub) && comment.author.id === user.sub) ? 20 : 0}}>
                            {!isReply &&
                                <span onClick={onReply} className={classes.ReplyBtn}>Відповісти...</span>
                            }
                            {((isAuthenticated && user?.sub) && comment.author.id === user.sub) &&
                                <Flex gap={5} className={classes.ManageBar}>
                                    <Popconfirm title={"Ви впевнені?"} okButtonProps={{loading : isLoading}} onConfirm={onDelete}>
                                        <Button icon={<DeleteOutlined/>}/>

                                    </Popconfirm>
                                    <Button icon={<EditOutlined/>}/>
                                </Flex>
                            }
                        </Flex>

                    </Flex>
                </Flex>
                <span className={classes.text}>{comment.text}</span>
            </Flex>

            {comment.replies &&
            comment.replies.length > 0 && isNotShowAllReplies
                ?
                <span className={classes.showAllRepliesBtn}
                      onClick={() => setIsNotShowAllReplies(false)}>Показати ще {comment.replies.length} коментарів...</span>
                :
                <Flex vertical style={{marginLeft: 20}}>
                    {comment.replies !== null &&
                        comment.replies.map((reply) =>
                            <NewsComment isReply key={"reply-" + reply.id} comment={reply}/>
                        )
                    }
                </Flex>

            }
        </Flex>
    );
};


export default NewsComment;