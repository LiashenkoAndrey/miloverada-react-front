import React, {FC, useEffect, useState} from 'react';
import classes from './NewsNewCommentInput.module.css'
import newsCommentClasses from '../../components/NewsComment/NewsComment.module.css'
import {Button, Flex, Image, Input, notification, Tooltip} from "antd";
import TextareaAutosize from "react-textarea-autosize";
import {CloseOutlined, SendOutlined} from "@ant-design/icons";
import {saveNewsComment} from "../../API/services/NewsCommentService";
import {useAuth0} from "@auth0/auth0-react";
import {containsCyrillicCharacters, isValidEmail, isWoman} from "../../API/Util";
import {useActions} from "../../hooks/useActions";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import NewsCommenter from "../NewsComment/NewsCommenter/NewsCommenter";

interface NewsNewCommentInputProps {
    newsId : number
}

const NewsNewCommentInput: FC<NewsNewCommentInputProps> = ({newsId}) => {
    const {setNewsComments, setReplyComment} = useActions()
    const {comments, replyComment} = useTypedSelector(state => state.newsComments)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [warning, setWarning] = useState<string | null>(null)
    const [text, setText] = useState<string>('')
    const [name, setName] = useState<string>('')
    const {isAuthenticated, user} = useAuth0()
    const [email, setEmail] = useState<string>('')

    useEffect(() => {
        if (text === '') {
            setWarning("Напишіть що думаєте")
            return
        }

        if (text.length > 3000) {
            setWarning("Коментар занадто довгий")
            return
        }

        if (text.length < 3) {
            setWarning("Коментар занадто короткий, спробуйте розкрийти свою думку")
            return
        }

        if (!isAuthenticated) {
            if (name === '') {
                setWarning("Вкажіть ім'я")
                return;
            }

            if (name.length <= 1) {
                setWarning("Ім'я занадто коротке")
                return;
            }

            if (!containsCyrillicCharacters(name)) {
                setWarning("Ім'я має бути Українською")
                return;
            }

            if (email) {
                if (!isValidEmail(email)) {
                    setWarning("Невірно введена пошта")
                    return;
                }
            }
        }

        setWarning(null)

    }, [text, name, email]);


    const onSend = async () => {
        if (text) {
            const json: { [key: string]: any } = {
                text: text
            }

            if (replyComment) {
                json.commentId = replyComment.id
            } else {
                json.newsId = String(newsId)
            }

            if (isAuthenticated) {
                if (user?.sub) {
                    json.appUserId = encodeURIComponent(user.sub)
                } else console.error("user is sub null but it is auth")
            } else {
                json.newsCommenter = {
                    id: null,
                    firstName: name,
                    email: email
                }
            }
            setIsLoading(true)
            const {data, error} = await saveNewsComment(json)
            setIsLoading(false)
            if (data) {
                setEmail('')
                setName('')
                setText('')
                setWarning(null)
                if (replyComment) {
                    comments[comments.indexOf(replyComment)].replies.push(data)
                    setNewsComments(comments)
                    setReplyComment(null)
                    notification.success({message : "Коментар додано"})
                } else {
                    setNewsComments([data, ...comments])
                }
                setTimeout(() => {
                    const  elem = document.getElementById("commentId-" + data.id)
                    if (elem) {
                        elem.scrollIntoView({behavior : "smooth", block: "center", inline: "nearest"})
                        elem.classList.add("isHighlighted")
                        setTimeout(() => {
                            elem.classList.remove("isHighlighted")
                            elem.classList.add("stopHighlight")
                        }, 1000)
                    }
                }, 200)
            }
            if (error) {
                notification.error({message: error.message ? error.message.toString() : ""})
            }
        }
    }

    const onCancelReply = () => {
        setReplyComment(null)
    }

    return (
        <Flex justify={"center"}>
            <Flex vertical className={classes.Wrapper}>
                <span className={classes.title}>Напишіть що думаєте...</span>
                {replyComment &&
                    <Flex vertical gap={5} className={newsCommentClasses.Wrapper2} >
                        <Flex gap={5} justify={"space-between"} className={newsCommentClasses.nameAndTimeWrapper}>
                            <NewsCommenter author={replyComment.author}/>
                            <Button onClick={onCancelReply} icon={   <CloseOutlined/>}/>

                        </Flex>
                        <span className={newsCommentClasses.text}>{replyComment.text}</span>
                    </Flex>
                }
                <TextareaAutosize
                    id={"commentTextArea"}
                    className={classes.textArea}
                    maxLength={3000}
                    placeholder={"Я думаю..."}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <Flex justify={"end"} vertical gap={10}>
                    {!isAuthenticated &&
                        <Flex vertical>
                            <div style={{position: "relative", marginBottom: 16, height: "fit-content"}}>
                                <Input value={name}
                                       onChange={(e) => setName(e.target.value)}
                                       placeholder={"Ваше ім'я"}
                                />
                                {!containsCyrillicCharacters(name) &&
                                    <span style={{position: "absolute", bottom: -30, left: 5, color: "red", fontSize: 14, lineHeight: 1}}>Ім'я має бути Українською</span>

                                }
                            </div>
                            <Input value={email}
                                   style={{height: "fit-content"}}
                                   type={'email'}
                                   onChange={(e) => setEmail(e.target.value)}
                                   placeholder={"Електронна пошта"}
                            />
                        </Flex>
                    }

                    {warning ?
                        <Tooltip title={warning}>
                            <Button icon={<SendOutlined />}
                                    className={classes.submitBtn}
                                    style={{backgroundColor: replyComment ? "green" : "white"}}
                            >{replyComment  ? "Відповісти"  : "Надіслати"}</Button>
                        </Tooltip>
                        :
                        <Button loading={isLoading}
                                icon={<SendOutlined />}
                                onClick={onSend}
                                className={classes.submitBtn}
                                style={{backgroundColor: replyComment ? "green" : "white"}}
                        >{replyComment  ? "Відповісти"  : "Надіслати"}
                        </Button>
                    }
                </Flex>
            </Flex>

        </Flex>
    );
};

export default NewsNewCommentInput;