import React, {FC, useEffect, useState} from 'react';
import classes from './NewsComments.module.css'
import {getAllNewsCommentsById, INewsComment} from "../../API/services/NewsCommentService";
import {Button, Flex} from "antd";
import NewsComment from "../NewsComment/NewsComment";
import {useActions} from "../../hooks/useActions";
import {useTypedSelector} from "../../hooks/useTypedSelector";

interface NewsCommentsProps {
    newsId : number
}

interface CommentsListProps {
    comments : INewsComment[]
}
const CommentsList:FC<CommentsListProps> = ({comments}) => {
    return (
        <Flex gap={5} vertical>
            {comments.map((comment) =>
                <NewsComment isReply={false} key={"comment-" + comment.id}
                             comment={comment}
                />
            )}
        </Flex>
    );
}

const NewsComments: FC<NewsCommentsProps> = ({newsId}) => {
    const {setNewsComments} = useActions()
    const {comments} = useTypedSelector(state => state.newsComments)

    const getById = async () => {
        const {data, error} = await getAllNewsCommentsById(newsId);
        if (data){
            setNewsComments(data)
        }
        if (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getById()
    }, []);

    const [isNotShowAllComments, setIsNotShowAllComments ] = useState<boolean>( true)

    return (
        <Flex vertical className={classes.Wrapper} gap={10}>
            <span className={classes.title}>Коментарі</span>
            {comments.length > 5 && isNotShowAllComments
                ?
                <>
                    <CommentsList comments={comments.slice(0,5)}/>
                    <Flex justify={"center"}>
                        <Button style={{maxWidth: "fit-content"}} onClick={() => setIsNotShowAllComments(false)}>Показати ще {comments.length - 5} коментарів...</Button>
                    </Flex>

                </>
                :
                <CommentsList comments={comments}/>
            }
        </Flex>
    );
};

export default NewsComments;