import React, {CSSProperties, FC} from 'react';
import {Avatar, Flex} from "antd";

interface ChatImageProps {
    image? : string
    chatName : string
}

const Wrapper : CSSProperties = {
    borderRadius: 30,
    backgroundColor : "green",
    height : 50,
    width : 50,
    position: "relative"

}

const Text : CSSProperties = {
    color : "white",
    position : "absolute",
    top : "-4px",
    fontSize : 33
}


const ChatImage: FC<ChatImageProps> = ({image, chatName}) => {
    return image
        ?
        (<Avatar size={"large"} src={image}/>)
        :
            (
                <Flex style={Wrapper} justify={"center"} align={"center"}>
                    {chatName &&
                        <span style={Text}>
                            {chatName.charAt(0)}

                        </span>
                    }
                </Flex>
            )
};

export default ChatImage;
