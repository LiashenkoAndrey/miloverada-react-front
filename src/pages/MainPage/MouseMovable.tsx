import React, {CSSProperties, FC, useEffect, useState} from 'react';

interface MouseMovableProps {
  imgUrl : string
  wrapperStyle : CSSProperties
  style : CSSProperties
  className : string
  wrapperClass : string
  moveSpeed : number
}

const MouseMovable: FC<MouseMovableProps> = ({imgUrl, className, moveSpeed, wrapperStyle, wrapperClass, style}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: { clientX: any; clientY: any; }) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const offsetX = (clientX - centerX) / moveSpeed; // Зміна швидкості руху
      setPosition({ x: offsetX, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const styles : CSSProperties = {
    left : position.x,
    top : '154px',
    clipPath : style.clipPath,
    zIndex: 10,
    position: "relative"

  };
  return (
      <div style={{position: "absolute", top: "-127px", left: "594px"}} >
        <img src={imgUrl} style={styles} alt=""/>
      </div>
  );
};

export default MouseMovable;