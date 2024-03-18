import React, {useCallback, useEffect, useState} from 'react';
import {Flex} from "antd";
import './ChatPage.css'
import {useParams} from "react-router-dom";
import ChatWindow from "../../../components/ChatWindow/ChatWindow";
import {StompSessionProvider} from "react-stomp-hooks";
import {useActions} from "../../../hooks/useActions";
import {getChatById} from "../../../API/services/forum/ChatService";
import classes from "../AllTopicsPage/AllForumTopicsPage.module.css";
import ContentList from "../AllTopicsPage/ContentList/ContentList";
import {useAuth0} from "@auth0/auth0-react";

const ChatPage = () => {
    const {setChatId, setHasPreviousMessages} = useActions()
    const {id} = useParams()
    const {isLoading, user} = useAuth0()
    const [leftPanelWidth, setLeftPanelWidth] = useState<number>(500)
    const {setChatInfo} = useActions()

    const initChat = async (chatId: number, userId? : string) => {
        const {data, error} = await getChatById(chatId, userId);
        if (data) {
            setChatInfo(data)
        }
        if (error) throw error;
    }

    useEffect(() => {
        if (!isLoading) {
            if (user?.sub) {
                initChat(Number(id), encodeURIComponent(user.sub))
            } else {
                initChat(Number(id))
            }
        }

    }, [isLoading, user?.sub, id]);
    useEffect(() => {
        setHasPreviousMessages(true)
        setChatId(Number(id))
    }, [id]);


    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false)
    const [initialPosition, setInitialPosition] = useState<{ x: number; y: number } | null>(null);

    const test = useCallback((event: MouseEvent) => {
        var initPos = initialPosition
        if (initPos === null) {
            initPos = {x : event.clientX, y :4}
        }

        const res =leftPanelWidth + (event.clientX  - initPos.x)
        if (res >= 460) {
            setLeftPanelWidth(leftPanelWidth + (event.clientX  - initPos.x))
            setPosition({
                x: event.clientX - initPos.x,
                y: event.clientY - initPos.y,
            });
        }
    }, [initialPosition, isDragging, leftPanelWidth]);


    const handleMouseUp = () => {
        document.body.style.cursor = "initial"
        document.removeEventListener("mouseup", handleMouseUp)
        document.removeEventListener("mousemove", test)
        setIsDragging(false);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setInitialPosition({
            x: event.clientX - position.x,
            y: event.clientY - position.y,
        });
        document.body.style.cursor = "grabbing"
        document.addEventListener("mouseup", handleMouseUp)
        document.addEventListener("mousemove", test)
    };

    const [timeId, setTimeId] = useState<NodeJS.Timeout>()

    const handleSliderMouseMove = () => {
        if (timeId === undefined) {
            const timeout = setTimeout(() => {
                setIsDraggingSlider(true)

            }, 500)
            setTimeId(timeout)
        } else  {
        }
    }

    const handleSliderMouseLeave = () => {
        clearTimeout(timeId)
        setIsDraggingSlider(false)
        setTimeId(undefined)
    }

    return (
        <Flex  className={['chatPageWrapper',  classes.forumBg].join(' ')} align={"flex-start"} justify={"center"}>
            <Flex className={"chatWrapper"} justify={"center"}>
                <Flex className={"leftContent"}
                      style={{overflowY: "scroll", height: "100vh", width: leftPanelWidth}}
                >
                    <ContentList/>
                </Flex>

                <div className={"changeSizeLine"}
                     onMouseDown={handleMouseDown}
                     onMouseLeave={handleSliderMouseLeave}
                     onMouseMove={handleSliderMouseMove}
                     style={{cursor: isDragging ? 'grabbing' : 'grab'}}
                >
                    <div style={{opacity : (isDraggingSlider || isDragging) ? 1 : 0}} className={"bodyChangeLine"}/>
                </div>

                <StompSessionProvider url={'http://localhost:6060/ws-endpoint'}>
                    <ChatWindow />
                </StompSessionProvider>
            </Flex>
        </Flex>
    );
};

export default ChatPage;