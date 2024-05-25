import React, {FC, useEffect, useState} from 'react';
import {ConfigProvider, Flex, Segmented} from "antd";
import classes from "../ForumPage.module.css";
import {useLocation} from "react-router-dom";
import {UnorderedListOutlined, WechatOutlined} from "@ant-design/icons";
import TopicsList from "../TopicsList/TopicsList";
import CreateContentBtnsAndStoriesList from "../../../../components/forum/StoriesList/CreateContentBtnsAndStoriesList";
// @ts-ignore
import posIcon from '../../../../assets/posIcon.svg'
import PostList from "../../../../components/forum/PostList/PostList";
import ChatsList, {Modes} from "../../../../components/forum/ChatsList/ChatsList";
import {useAuth0} from "@auth0/auth0-react";
import {useActions} from "../../../../hooks/useActions";
import {useTypedSelector} from "../../../../hooks/useTypedSelector";
import locale from "antd/es/locale/uk_UA";

interface ChatsListProps {
}


const ContentList: FC<ChatsListProps> = () => {
    const {isAuthenticated} = useAuth0()
    const loc = useLocation()
    const [iMode, setIMode] = useState<Modes>()
    const {setContentMode} = useActions()
    const {contentMode} = useTypedSelector(state => state.forum)


    const onSelectMode = (val: string) => {
        const contentMode: Modes = val as Modes
        setIMode(contentMode)
        setContentMode(contentMode)
    }

    useEffect(() => {
        let sp = new URLSearchParams(loc.search)
        const mode = sp.get("mode")
        if (mode !== null) {
            const contentMode: Modes = mode.toUpperCase() as Modes
            setIMode(contentMode)
            setContentMode(contentMode)
        } else {
            if (contentMode !== null) {
                setIMode(contentMode)
            } else {
                setDefaultContentMode();
            }
        }
    }, []);

    function setDefaultContentMode() {
        setIMode(Modes.POSTS)
        setContentMode(Modes.POSTS)
    }


    const getOptions = () => {
        const options = []
        if (isAuthenticated) {
            options.push({
                label: (
                    <div style={{padding: 4}}>
                        <WechatOutlined style={{color: "#B1B8BEFF", fontSize: 20}}/>
                        <div style={{color: "#B1B8BEFF"}}>Чати</div>
                    </div>
                ),
                value: Modes.CHATS,

            },)
        }
        options.push({
            label: (
                <div style={{padding: 4, color: "#B1B8BEFF"}}>
                    <UnorderedListOutlined style={{fontSize: 20}}/>
                    <div>Теми</div>
                </div>
            ),
            value: Modes.TOPICS,
        })
        options.push({
            label: (
                <div style={{padding: 4, color: "#B1B8BEFF"}}>
                    <img height={30} src={posIcon}/>
                    <div>Пости</div>
                </div>
            ),
            value: Modes.POSTS,
        })
        return options;
    }
    return (
        <Flex className={classes.ContentList} vertical>
            <Flex style={{width: "100%"}} justify={"space-between"}>
                <CreateContentBtnsAndStoriesList isPost={iMode === Modes.POSTS} isTopic={iMode === Modes.TOPICS}/>
                <ConfigProvider locale={locale} theme={{
                    components: {
                        Segmented: {
                            itemSelectedBg: "rgba(94,94,107,0.46)",
                        }
                    }
                }}>

                    <Segmented options={getOptions()}
                               style={{backgroundColor : "#191a24", userSelect : "none"}}
                               value={iMode}
                               onChange={(e) => onSelectMode(e.toString())}
                    />
                </ConfigProvider>
            </Flex>
            {iMode === Modes.TOPICS &&
                <TopicsList/>
            }

            {(iMode === Modes.CHATS && isAuthenticated) &&
                <ChatsList/>

            }

            {iMode === Modes.POSTS &&
                <PostList/>
            }
        </Flex>
    )
};

export default ContentList;
