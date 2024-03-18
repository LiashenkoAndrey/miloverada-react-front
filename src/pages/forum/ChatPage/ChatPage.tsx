import React, {useCallback, useEffect, useState} from 'react';
import {Flex} from "antd";
import './ChatPage.css'
import {useParams} from "react-router-dom";
import ChatWindow from "../../../components/ChatWindow/ChatWindow";
import {StompSessionProvider} from "react-stomp-hooks";
import {useActions} from "../../../hooks/useActions";
import {IChat} from "../../../API/services/forum/ForumInterfaces";
import {getChatById} from "../../../API/services/forum/ChatService";
import classes from "../AllTopicsPage/AllForumTopicsPage.module.css";
import ContentList from "../AllTopicsPage/ContentList/ContentList";
import {useAuth0} from "@auth0/auth0-react";

const ChatPage = () => {
    const {setChatId, setHasPreviousMessages} = useActions()
    const {id, mode} = useParams()
    const [chat, setChat] = useState<IChat>();
    const {isLoading, user} = useAuth0()
    const [leftPanelWidth, setLeftPanelWidth] = useState<number>(500)

    useEffect(() => {
        console.log(mode)
    }, [mode]);

    const initChat = async (chatId: number, userId? : string) => {
        const {data, error} = await getChatById(chatId, userId);
        if (data) {
            setChat(data)
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

    }, [isLoading, user?.sub]);
    useEffect(() => {
        setHasPreviousMessages(true)
        setChatId(Number(id))
    }, []);


    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false)
    const [initialPosition, setInitialPosition] = useState<{ x: number; y: number } | null>(null);
    const [clientX, setClientX] = useState<number>()




    const test = useCallback((event: MouseEvent) => {
        // console.log(isDragging, initialPosition)
        var initPos = initialPosition
        if (initPos === null) {
            initPos = {x : event.clientX, y :4}
        }
        // console.log("move", event.clientX, initPos.x, leftPanelWidth)
        //
        // console.log(
        //     event.clientX - initPos.x,
        //     leftPanelWidth + (event.clientX  - initPos.x),
        //     event.clientX
        // )
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
        console.log("mouse up")
        document.body.style.cursor = "initial"
        document.removeEventListener("mouseup", handleMouseUp)
        document.removeEventListener("mousemove", test)
        setIsDragging(false);
        // setInitialPosition(null);

    };

    useEffect(() => {
        console.log(isDragging)
    }, [isDragging]);

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setInitialPosition({
            x: event.clientX - position.x,
            y: event.clientY - position.y,
        });

        console.log("down")
        document.body.style.cursor = "grabbing"
        document.addEventListener("mouseup", handleMouseUp)
        document.addEventListener("mousemove", test)



    };


    const [timeId, setTimeId] = useState<NodeJS.Timeout>()

    const handleSliderMouseMove = () => {
        console.log('move, is graf', isDragging)
        if (timeId === undefined) {
            console.log("show")
            const timeout = setTimeout(() => {
                setIsDraggingSlider(true)

            }, 500)
            setTimeId(timeout)
            console.log("handleSliderMouseMove")
        } else  {
            console.log("undef")
        }
    }

    const handleSliderMouseLeave = () => {
        console.log(timeId)
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
                    <ChatWindow chat={chat}/>
                </StompSessionProvider>
            </Flex>
        </Flex>
    );
};

export default ChatPage;