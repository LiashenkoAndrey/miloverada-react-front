import React from "react";


export interface INews {
    id?: number,
    description? : string,
    image_id? : string,
    created? : Array<string>,
    main_text? : string,
    newsType? : string
    style? : React.CSSProperties | undefined
    views : number
}