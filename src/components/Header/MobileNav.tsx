import React, {FC} from 'react';
import {HeaderOption} from "./Header";

interface MobileNavProps {
    options : HeaderOption[]
}

const MobileNav: FC<MobileNavProps> = ({options}) => {
    return (
        <>
            {options.map((o) =>
                <span onClick={o.onClick}>{o.title}</span>
            )}
        </>
    );
};

export default MobileNav;