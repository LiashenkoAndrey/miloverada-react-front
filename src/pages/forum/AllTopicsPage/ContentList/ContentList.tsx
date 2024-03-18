import React, {FC, useEffect, useState} from 'react';
import {Flex, Segmented} from "antd";
import classes from "../AllForumTopicsPage.module.css";
import {useLocation} from "react-router-dom";
import {UnorderedListOutlined, WechatOutlined} from "@ant-design/icons";
import TopicsList from "../TopicsList/TopicsList";
import StoriesList from "../../../../components/forum/StoriesList/StoriesList";
import {motion} from 'framer-motion'
// @ts-ignore
import posIcon from '../../../../assets/posIcon.svg'
import PostList from "../../../../components/forum/PostList/PostList";
import ChatsList, {Modes} from "../../../../components/forum/ChatsList/ChatsList";
import {useAuth0} from "@auth0/auth0-react";
import {useActions} from "../../../../hooks/useActions";
import {useTypedSelector} from "../../../../hooks/useTypedSelector";

interface ChatsListProps {
}


const ContentList: FC<ChatsListProps> = () => {
    const {isAuthenticated} = useAuth0()
    const loc = useLocation()
    const [iMode, setIMode] = useState<Modes>()
    const {setContentMode} = useActions()
    const { contentMode} = useTypedSelector(state => state.forum)


    const onSelectMode = (val: string) => {
        const contentMode : Modes = val as Modes
        setIMode(contentMode)
        setContentMode(contentMode)
    }

    useEffect(() => {
        let sp = new URLSearchParams(loc.search)
        const mode = sp.get("mode")
        if (mode !== null) {
            const contentMode : Modes = mode.toUpperCase() as Modes
            setIMode(contentMode)
            setContentMode(contentMode)
        } else {
            console.log(contentMode)
            if (contentMode !== null) {
                setIMode(contentMode)
            } else {
                setIMode(Modes.TOPICS)
                setContentMode(Modes.TOPICS)
            }
        }
    }, []);

    const anim = {
        initial : {opacity : 0.8, x : 30},
        animate : {opacity : 1, x : 0},
        exit : {opacity : 0.6, x : -30}
    }
    const anim2= {
        initial : {opacity : 0.8, x : -30},
        animate : {opacity : 1, x : 0},
        exit : {opacity : 0.6, x : 30}
    }

    const getOptions = () => {
        const options = []
        if (isAuthenticated) {
            options.push( {
                label: (
                    <div style={{ padding: 4 }}>
                        <WechatOutlined style={{color: "#B1B8BEFF", fontSize: 20}} />
                        <div style={{color: "#B1B8BEFF"}} >Чати</div>
                    </div>
                ),
                value: Modes.CHATS,

            },)
        }
        options.push(  {
            label: (
                <div  style={{ padding: 4 , color: "#B1B8BEFF"}}>
                    <UnorderedListOutlined style={{fontSize: 20}} />
                    <div>Теми</div>
                </div>
            ),
            value: Modes.TOPICS,
        })
        options.push(    {
            label: (
                <div  style={{ padding: 4 , color: "#B1B8BEFF"}}>
                    <img height={30} src={posIcon} />
                    <div>Пости</div>
                </div>
            ),
            value: Modes.POSTS,
        })
        return options;
    }
    return (
        <Flex className={classes.ContentList} vertical>
                <Flex style={{width: "100%"}} justify={"space-between"} >
                    <StoriesList isPost={iMode === Modes.POSTS}/>
                    <Segmented style={{backgroundColor: "#191a24"}}
                               options={getOptions()}
                               value={iMode}
                               onChange={(e) => onSelectMode(e.toString())}
                    />
                </Flex>
                {iMode === Modes.TOPICS &&
                    <motion.div style={{flex : 1}}
                        variants={anim2}
                        initial={'initial'}
                        exit={'exit'}
                        animate={"animate"}
                        transition={{duration : 0.3}}
                    >
                        <TopicsList />
                    </motion.div>
                }

                {(iMode === Modes.CHATS && isAuthenticated) &&

                    <motion.div style={{flex : 1}}
                                variants={anim2}
                                initial={'initial'}
                                exit={'exit'}
                                animate={"animate"}
                                transition={{duration : 0.3}}
                    >
                        <ChatsList/>

                    </motion.div>
                }

                {iMode === Modes.POSTS &&
                    <motion.div style={{flex : 1}}
                        variants={anim}
                        initial={'initial'}
                        exit={'exit'}
                        animate={"animate"}
                        transition={{duration : 0.3}}
                    >
                        <PostList/>
                    </motion.div>
                }
        </Flex>
    )
};

export default ContentList;