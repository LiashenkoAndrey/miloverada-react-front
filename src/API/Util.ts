

export function toTime(date : Array<string>) {
    return `${formatVal(date[3])}:${formatVal(date[4])}`
}


export function toDate(date : Array<string>) {
    return `${date[0]}-${date[1]}-${date[2]}`
}

function formatVal(val : string) : string {
    return String(val).length === 1 ? "0" + val : val;
}