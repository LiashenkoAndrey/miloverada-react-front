

export function toTime(date : Array<string>) {
    return new Date(date.toString()).toTimeString().substring(0, 5)
}


export function toDate(date : Array<string>) {
    return `${date[0]}-${date[1]}-${date[2]}`
}

function formatVal(val : string) : string {
    return String(val).length === 1 ? "0" + val : val;
}