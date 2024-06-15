import React, {CSSProperties, FC, useEffect, useState} from 'react';
// @ts-ignore
import img from '../../assets/backgrounds/bg1.png';
import './AppTest.css';

interface ParallaxImageProps {
    imgUrl : string
    wrapperStyle : CSSProperties
    style : CSSProperties
    className : string
    wrapperClass : string
    moveSpeed : number
}

const ParallaxImage: FC<ParallaxImageProps> = ({imgUrl, className, moveSpeed, wrapperStyle, wrapperClass, style}) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: { clientX: any; clientY: any; }) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const offsetX = (clientX - centerX) / moveSpeed; // Зміна швидкості руху
            const offsetY = (clientY - centerY) / moveSpeed;
            setPosition({ x: offsetX, y: offsetY });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const styles : CSSProperties = {
        backgroundImage: `url(${imgUrl})`,
        backgroundPosition: `${50 + position.x}% ${50 + position.y}%`,
        transform: `rotateY(${position.x / 10}deg) rotateX(${position.y / 10}deg)`, // Оновлення кута нахилу
        left : '-343px',
        top : '154px',
        clipPath : style.clipPath

    };
    return (
        <div className={["parallaxImageWrapper", wrapperClass].join(' ')}
             style={wrapperStyle}
        >
            <div className={["ParallaxImage", className].join(' ')} style={styles}>

            </div>
        </div>
    );
};

export default ParallaxImage;