import React, {useCallback, useEffect, useState} from 'react';
import {Flex} from "antd";
import './ChatPage.css'
import {useLocation, useParams} from "react-router-dom";
import ChatWindow from "../../../components/ChatWindow/ChatWindow";
import {StompSessionProvider} from "react-stomp-hooks";
import {useActions} from "../../../hooks/useActions";
import {IChat} from "../../../API/services/forum/ForumInterfaces";
import {getChatById} from "../../../API/services/forum/ChatService";
import classes from "../AllTopicsPage/AllForumTopicsPage.module.css";
import ContentList from "../AllTopicsPage/ContentList/ContentList";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {useAuth0} from "@auth0/auth0-react";
import { throttle } from 'lodash';

const ChatPage = () => {
    const {setChatId, setHasPreviousMessages} = useActions()
    const {id} = useParams()
    const [chat, setChat] = useState<IChat>();
    const {isLoading, user} = useAuth0()
    const [leftPanelWidth, setLeftPanelWidth] = useState<number>(500)

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


    // const handleMouseMove = throttle((event: React.MouseEvent<HTMLDivElement>) => {
    //     // if (!isDragging || !initialPosition) return;
    //     console.log(isDragging, initialPosition)
    //     if (isDragging && initialPosition) {
    //         console.log("move", event.clientX, initialPosition.x, leftPanelWidth)
    //
    //         console.log(
    //             event.clientX - initialPosition.x,
    //             leftPanelWidth + ((event.clientX + 5) - initialPosition.x),
    //             event.clientX
    //         )
    //         const dif = event.clientX - initialPosition.x
    //         const num = 5
    //         setLeftPanelWidth( leftPanelWidth  + (dif < 0 ? dif - num : dif + num))
    //         setPosition({
    //             x: event.clientX - initialPosition.x,
    //             y: event.clientY - initialPosition.y,
    //         });
    //     } else {
    //         console.log("null", initialPosition)
    //     }
    //
    //
    // }, 10); // Change 100 to adjust the throttle delay


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
                {/*<div*/}
                {/*    className={"grab"}*/}
                {/*    style={{*/}
                {/*        position: 'absolute',*/}
                {/*        width: 200,*/}
                {/*        height: 200,*/}
                {/*        backgroundColor: "red",*/}
                {/*        top: position.y,*/}
                {/*        left: position.x,*/}
                {/*        cursor: isDragging ? 'grabbing' : 'grab',*/}
                {/*    }}*/}
                {/*    onMouseDown={handleMouseDown}*/}
                {/*    // onMouseMove={handleMouseMove}*/}
                {/*>*/}
                {/*    Drag me*/}
                {/*</div>*/}

                <StompSessionProvider url={'http://localhost:6060/ws-endpoint'}>
                    <ChatWindow chat={chat}/>
                </StompSessionProvider>
            </Flex>
        </Flex>
    );
};

export default ChatPage;