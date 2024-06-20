import React, {CSSProperties, FC, useState} from 'react';
import classes from './TextAreaAutosize.module.css'
import {stringContainsOnlySpaces} from "../../API/Util";


interface TextAreaAutosizeProps {
    props: React.HTMLProps<HTMLTextAreaElement>
    input : string
    className : string
    // @ts-ignore
    onButtonsPressWhenFocusInput: (key: KeyboardEvent<HTMLTextAreaElement>) => void
}
const LINE_HEIGHT_STEP = 37

const TextAreaAutosize: FC<TextAreaAutosizeProps> = ({input, className, props, onButtonsPressWhenFocusInput}) => {
    const [height, setHeight] = useState<number>(LINE_HEIGHT_STEP)

    function has_scrollbar() {
        //@ts-ignore
        const r: React.MutableRefObject<HTMLTextAreaElement | null> = props.ref;
        if (r.current) {
            return r.current.clientHeight < r.current.scrollHeight
        }
    }

    // @ts-ignore
    function pressedEnterWithShift(key: KeyboardEvent<HTMLTextAreaElement>) {

        return key.key === "Enter" && key.shiftKey
    }

    // @ts-ignore
    const onButtonsPress = (key: KeyboardEvent<HTMLTextAreaElement>) => {
        onButtonsPressWhenFocusInput(key)
        has_scrollbar()
        if (pressedEnterWithShift(key) && height < 400) {
            setHeight(height + LINE_HEIGHT_STEP)
        } else if (key.code === "Backspace") {
            // console.log("backspase handled, " , height > LINE_HEIGHT_STEP, !has_scrollbar())
            if  (height > LINE_HEIGHT_STEP && !has_scrollbar()) {
                setHeight(height - LINE_HEIGHT_STEP)
            }
        } else if (key.code === "Enter" && !key.shiftKey && !stringContainsOnlySpaces(input)) {
            setHeight(LINE_HEIGHT_STEP)
        }



    }
    return (
        <textarea className={[className,classes.textArea].join(' ')} {...props} onKeyDownCapture={onButtonsPress}
                  style={{width: "100%", boxSizing: "border-box", height: height, top : -height + LINE_HEIGHT_STEP }}
        >
        </textarea>
    );
};

export default TextAreaAutosize;
