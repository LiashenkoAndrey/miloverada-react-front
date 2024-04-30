import {jwtDecode} from "jwt-decode";


const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

export function toTime(date : Array<string>) {
    return new Date(date.toString()).toTimeString().substring(0, 5)
}

export const NOT_AUTH_MSG = {message : "Не авторизовано"}

export function getRandomColor(): string {
    const letters: string = '0123456789ABCDEF';
    let color: string = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
export function generateContrastColor2() : string {
    // Генеруємо випадковий колір для тексту
    const randomColor = getRandomColor()
    const background = "#5C4742"
    // Перевірка яскравості кольору фону
    const brightness = (
        parseInt(background.substring(1, 3), 16) * 0.299 +
        parseInt(background.substring(3, 5), 16) * 0.587 +
        parseInt(background.substring(5, 7), 16) * 0.114
    );

    // Перевірка контрастності випадкового коліру тексту з фоном
    const textColorBrightness = (
        parseInt(randomColor.substring(1, 3), 16) * 0.299 +
        parseInt(randomColor.substring(3, 5), 16) * 0.587 +
        parseInt(randomColor.substring(5, 7), 16) * 0.114
    );

    // Якщо контрастність достатня, повертаємо випадковий колір тексту
    if (Math.abs(brightness - textColorBrightness) > 125) {
        return randomColor;
    } else {
        // Якщо контрастність недостатня, рекурсивно викликаємо функцію для генерації нового коліру
        return generateContrastColor2();
    }
}



export function toDate(date : Array<string>) {
    return new Date(date.toString()).toLocaleString()
}

export function toDateShort(date : Array<string>) {
    return new Date(date.toString()).toLocaleString().split(",")[0]
}

export function toDateV2(date : string) {
    const t = date.split("T")
    return t[0]
}

export function isValidEmail(email : string) {
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

export  function containsCyrillicCharacters(str : string) {
    if (str === "") return true;
    // Regular expression to match Cyrillic characters
    var cyrillicRegex = /^[а-яА-ЯіЇ]+$/;

    // Test if the string contains Cyrillic characters
    return cyrillicRegex.test(str);
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