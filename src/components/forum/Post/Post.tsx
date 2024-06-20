import React, {FC, useContext} from 'react';
import {deletePostById, IPost} from "../../../API/services/forum/PostService";
import {Button, Dropdown, Flex, Image, MenuProps, notification} from "antd";
import {getImageV2Url} from "../../../API/services/ImageService";
import classes from './Post.module.css'
// @ts-ignore
import heartImg from '../../../assets/heart-svgrepo-com.svg'
// @ts-ignore
import chatImg from '../../../assets/chat-round-line-svgrepo-com.svg'
import {toDateV2} from "../../../API/Util";
import '../../../App.css'
// @ts-ignore
import placeholder from '../../../assets/image-placeholder-forum.svg'
import PostLike from "../PostLike/PostLike";
import {DeleteOutlined, EditOutlined, MoreOutlined, ShareAltOutlined} from "@ant-design/icons";
import {AuthContext} from "../../../context/AuthContext";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {useActions} from "../../../hooks/useActions";
//@ts-ignore
import verifiedUserIcon from '../../../assets/verified-symbol-icon.svg'

interface PostProps {
    post: IPost
}


const Post: FC<PostProps> = ({post}) => {
    const {jwt} = useContext(AuthContext)
    const {posts} = useTypedSelector(state => state.forum)
    const {setPosts} = useActions()

    const moreItems: MenuProps['items'] = [
        {
            key: 'moreItems-edit',
            label: 'Редагувати',
            icon : <EditOutlined/>,
            disabled : true
        },
        {
            key: 'moreItems-share',
            label: 'Поділитися',
            icon : <ShareAltOutlined/>,
        },
        {
            key: 'moreItems-delete',
            danger: true,
            icon: <DeleteOutlined/>,
            label: 'Видалити пост',
        },
    ];

    const deletePost = async () => {
        if (!jwt) {
            notification.warning({message : "Не авторизовано"})
            return;
        }
        const {data, error} = await deletePostById(post.id, jwt)

        if (data) {
            console.log("Post deleted ok")
            setPosts([...posts.filter((e) => e.id !== post.id)])

        }
        if (error) {
            notification.warning({message : "Не можемо видалити пост.. :( Спробуйте пізніше"})
        }
    }

    const onSelectAction: MenuProps['onClick'] = ({ key }) => {
        const values = key.split("-")
        const action = values[1]
        switch (action) {
            case "edit" :
                break;
            case 'delete':
                deletePost()
                break;
            default :
                console.error("def")
        }
    }

    return (
        <Flex vertical gap={10} style={{maxWidth: 600, maxHeight: 700}}>
            <Flex gap={10} justify={"space-between"}>
                <Flex style={{userSelect: "none"}}
                      align={"center"}
                      gap={5}
                >

                    <Image height={40}
                           width={40}
                           className={"imageWithPlaceholder"}
                           style={{borderRadius: 20}}
                           src={post.author.avatar.includes("http") ? post.author.avatar : getImageV2Url(post.author.avatar)}
                    />
                    <span style={{color: "white"}}>{post.author.nickname}</span>
                    {post.author.isVerified &&
                        <img src={verifiedUserIcon} height={20} width={20} alt=""/>
                    }
                </Flex>

                {jwt &&
                    <Dropdown menu={{items : moreItems, onClick : onSelectAction}}
                              trigger={["click"]}
                    >
                        <Button style={{border: "none"}}
                                icon={<MoreOutlined className={classes.moreMenuBtn}  />} ghost
                        />
                    </Dropdown>
                }

            </Flex>
            <Flex vertical>
                <Image style={{userSelect: "none"}} placeholder={
                    <img className={classes.image2}
                         src={placeholder}
                         alt="placeholder"
                    />
                }
                       className={classes.image}
                       src={getImageV2Url(post.imageId)}
                />
                <Flex vertical style={{color: "white"}}>
                    <span>{post.text}</span>
                    <span style={{userSelect: "none"}}>{toDateV2(post.createdOn)}</span>
                </Flex>
                <Flex className={classes.buttons} align={"center"} gap={10}>
                    <PostLike post={post}/>

                    {/*<PostComments post={post}/>*/}
                </Flex>
            </Flex>

        </Flex>
    );
};

export default Post;
