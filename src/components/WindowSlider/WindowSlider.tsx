import React, {FC, useCallback, useState} from 'react';

interface WindowSliderProps {
    leftPanelWidth: number
    setLeftPanelWidth: React.Dispatch<React.SetStateAction<number>>
}

const WindowSlider: FC<WindowSliderProps> = ({leftPanelWidth, setLeftPanelWidth}) => {
    const [position, setPosition] = useState<{ x: number; y: number }>({x: 0, y: 0});
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false)
    const [initialPosition, setInitialPosition] = useState<{ x: number; y: number } | null>(null);

    const test = useCallback((event: MouseEvent) => {
        var initPos = initialPosition
        if (initPos === null) {
            initPos = {x: event.clientX, y: 4}
        }

        const res = leftPanelWidth + (event.clientX - initPos.x)
        if (res >= 460) {
            setLeftPanelWidth(leftPanelWidth + (event.clientX - initPos.x))
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
        } else {
        }
    }

    const handleSliderMouseLeave = () => {
        clearTimeout(timeId)
        setIsDraggingSlider(false)
        setTimeId(undefined)
    }

    return (
        <div className={"changeSizeLine"}
             onMouseDown={handleMouseDown}
             onMouseLeave={handleSliderMouseLeave}
             onMouseMove={handleSliderMouseMove}
             style={{cursor: isDragging ? 'grabbing' : 'grab'}}
        >
            <div style={{opacity: (isDraggingSlider || isDragging) ? 1 : 0}} className={"bodyChangeLine"}/>
        </div>
    );
};

export default WindowSlider;