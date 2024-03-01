import {jwtDecode} from "jwt-decode";


const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

export function toTime(date : Array<string>) {
    return new Date(date.toString()).toTimeString().substring(0, 5)
}


export function toDate(date : Array<string>) {
    return new Date(date.toString()).toLocaleString()
}

export function toDateShort(date : Array<string>) {
    return new Date(date.toString()).toLocaleString().split(",")[0]
}

export function getFileUploadUrl(isLarge : boolean | undefined, id : string | undefined) {
    if (isLarge === undefined || id === undefined) {
        console.error("is undefined")
        return "/none"
    }
    if (isLarge) {
        return apiServerUrl + "/api/forum/upload/largeFile/" + id;
    }
    return apiServerUrl + "/api/forum/upload/file/" + id;
}

export function formatFileSize(size: number): string {
    if (String(Math.round(size)).length >= 7) {
        const res = Number(size) / 1000000
        if (res.toString().indexOf(".") !== -1) {

            return res.toString().substring(0, res.toString().indexOf(".")) + res.toString().substring(res.toString().indexOf("."), 4) + " MB"
        }
        return res + " MB"
    } else return `${Math.round(Number(size) / 1000)} KB`
}

export const getBase64 = (file : File, cb : Function) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result, file.name)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

export const getBase642 = (blob : Blob, cb : Function) => {
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = function () {
        cb(reader.result, "test")
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

export const checkPermission = (token : string, permission : string) => {
    if (token !== null) {
        const  payload = jwtDecode(token);

        console.log("payload", payload)

        // @ts-ignore
        const  has = jwtDecode(token).permissions.indexOf(permission) !== -1
        return has;
    } else {
        return false
    }
}