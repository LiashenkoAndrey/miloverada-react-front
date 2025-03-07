import {jwtDecode} from "jwt-decode";
import {callAndGetResult} from "./services/shared/ExternalApiService";
import {message} from "antd";

const API_SERVER_URL = process.env.REACT_APP_API_SERVER_URL;
const HEALTH_CHECK_PROXY_SERVER_URL = process.env.REACT_APP_HEALTH_CHECK_PROXY_SERVER_URL;

export const checkImageTypeBeforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
        message.error('Ви можете завантажити лише зоображення!');
    }
    return isImage;
};


declare global {
    interface String {
        formatted(...args: any[]): string;
    }
}

// Add the formatted method to the String prototype
String.prototype.formatted = function (...args: any[]): string {
    return this.replace(/%s/g, () => args.shift());
};

export function toTime(date: Array<string>) {
    return new Date(date.toString()).toTimeString().substring(0, 5)
}

export const NOT_AUTH_MSG = {message: "Не авторизовано"}

export function getRandomColor(): string {

    const letters: string = '0123456789ABCDEF';
    let color: string = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function generateContrastColor2(): string {
    const randomColor = getRandomColor()
    const background = "#5C4742"
    const brightness = (
        parseInt(background.substring(1, 3), 16) * 0.299 +
        parseInt(background.substring(3, 5), 16) * 0.587 +
        parseInt(background.substring(5, 7), 16) * 0.114
    );

    const textColorBrightness = (
        parseInt(randomColor.substring(1, 3), 16) * 0.299 +
        parseInt(randomColor.substring(3, 5), 16) * 0.587 +
        parseInt(randomColor.substring(5, 7), 16) * 0.114
    );

    if (Math.abs(brightness - textColorBrightness) > 125) {
        return randomColor;
    } else {
        return generateContrastColor2();
    }
}

export function stringContainsOnlySpaces(str: string) {
    return !str.replace(/\s/g, '').length;
}

export function toDate(date: Array<string>) {
    return new Date(date.toString()).toLocaleString()
}

export function toDateShort(date: Array<string>) {
    return new Date(date.toString()).toLocaleString().split(",")[0]
}

export function toDateV2(date: string) {
    const t = date.split("T")
    return t[0]
}

var fulldays = ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"];
var months = ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"];

export function formatDate(someDateTimeStamp: string) {
    let dt = new Date(someDateTimeStamp),
        date = dt.getDate(),
        month = months[dt.getMonth()],
        // @ts-ignore
        diffDays = new Date().getDate() - date,
        diffMonths = new Date().getMonth() - dt.getMonth(),
        diffYears = new Date().getFullYear() - dt.getFullYear();

    if (diffYears === 0 && diffDays === 0 && diffMonths === 0) {
        return "Сьогодні";
    } else if (diffYears === 0 && diffDays === 1) {
        return "Вчора";
    } else if (diffYears === 0 && diffDays === -1) {
        return "Завтра";
    } else if (diffYears === 0 && (diffDays < -1 && diffDays > -7)) {
        return fulldays[dt.getDay()];
    } else if (diffYears >= 1) {
        return month + " " + date + ", " + new Date(someDateTimeStamp).getFullYear();
    } else {
        return month + " " + date;
    }
}

export function formatDateTodayOrYesterday(someDateTimeStamp: string) {
    console.log(someDateTimeStamp)
    let dt = new Date(someDateTimeStamp),
        date = dt.getDate(),
        diffDays = new Date().getDate() - date,
        diffMonths = new Date().getMonth() - dt.getMonth(),
        diffYears = new Date().getFullYear() - dt.getFullYear();

    if (diffYears === 0 && diffDays === 0 && diffMonths === 0) {
        return "(Сьогодні)";
    } else if (diffYears === 0 && diffDays === 1) {
        return "(Вчора)";
    } else if (diffYears === 0 && diffDays === -1) {
        return "(Завтра)";
    }
    else return ""
}

export function isValidEmail(email: string) {
    // Regular expression for validating email addresses
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test if the string matches the email regular expression
    return emailRegex.test(email);
}

export function isWoman(nameStr: string | undefined) {
    if (!nameStr) return false;
    const name = nameStr.split(" ")[0]
    if (name.endsWith('а') || name.endsWith('я') || name.endsWith('ов') || name.endsWith('ов')) {
        return true;
    }
    return false;
}

export function containsCyrillicCharacters(str: string) {
    if (str === "") return true;
    // Regular expression to match Cyrillic characters
    var cyrillicRegex = /^[а-яА-ЯіЇ]+$/;

    // Test if the string contains Cyrillic characters
    return cyrillicRegex.test(str);
}

export function getFileUploadUrl(isLarge: boolean | undefined, id: string | undefined) {
    if (isLarge === undefined || id === undefined) {
        console.error("is undefined")
        return "/none"
    }
    if (isLarge) {
        return API_SERVER_URL + "/api/forum/upload/largeFile/" + id;
    }
    return API_SERVER_URL + "/api/forum/upload/file/" + id;
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

export const getBase64 = (file: File, cb: Function) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result, file.name)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

export const getBase642 = (blob: Blob, cb: Function) => {
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = function () {
        cb(reader.result, "test")
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
}

interface JwtPayload {
    permissions: string[]
    scope: string
    sub: string
}

export const checkPermission = (token: string | undefined, permission: string) => {
    if (token !== undefined) {
        const payload: JwtPayload = jwtDecode(token);
        return payload.permissions.includes(permission);
    } else {
        return false
    }
}

type ServerHealthResponse = {
    data: { serverUp: boolean };
    error?: any;
};

export const checkServerHealth = () :  Promise<ServerHealthResponse> => {
    const config = {
        url: HEALTH_CHECK_PROXY_SERVER_URL,
        method: "GET",
    }
    return callAndGetResult(config)
};

export function secToMilisec(sec : number) {
    return sec * 1000
}

export function generateClientTempId() {
    return generateRandomString(5);
}

function generateRandomString(length : number) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}