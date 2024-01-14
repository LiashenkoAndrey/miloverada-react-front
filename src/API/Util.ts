

export function toTime(date : Array<string>) {
    return new Date(date.toString()).toTimeString().substring(0, 5)
}


export function toDate(date : Array<string>) {
    return new Date(date.toString()).toLocaleString()
}
