import React from 'react';
import classes from './MainPageParalax.module.css'
// @ts-ignore
import img from '../../assets/backgrounds/bg1.png';


const MainPageImageParallax = () => {
    return (
        <div className={classes.wrapper}>
            <div className={classes.paralax}>
                <div className={classes.paralax_body}>
                    <div className={[classes.paralax_images, classes.images_paralax].join(' ')}>
                        <div className={classes.images_parallax_item}>
                            <img width={300} className={classes.parallax_item_1} src={img} alt=""/>
                        </div>

                        <div className={classes.images_parallax_item}>
                            <img  width={300}  className={classes.parallax_item_2} src={img} alt=""/>
                        </div>

                        <div className={classes.images_parallax_item}>
                            <img  width={300} src={img} className={classes.parallax_item_3} alt=""/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainPageImageParallax;