import {ChangeEvent, useState} from "react";


export default function useInput(initialValue? : string) {

    const [value, setValue] = useState<string | undefined>(initialValue)

    const onChange = (e :   ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const clear = () => {
        setValue('')
    }

    return {value, onChange, setValue, clear};

}
