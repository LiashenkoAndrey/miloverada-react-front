import {ChangeEvent, useState} from "react";


export default function useInput(initialValue? : string) {

    const [value, setValue] = useState<string | undefined>(initialValue)

    const onChange = (e :   ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        setValue(e.target.value)
    }

    return {value, onChange};

}