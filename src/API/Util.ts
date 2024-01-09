

export function toTime(date : Array<string>) {
    return new Date(date.toString()).toTimeString().substring(0, 5)
}
