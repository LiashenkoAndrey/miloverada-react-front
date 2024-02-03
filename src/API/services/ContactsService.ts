import {callAndGetResult} from "./ExternalApiService";
import {apiServerUrl} from "../Constants";


export interface IEmployee {
    id: number
    first_name : string
    last_name : string
    email : string
    phone_number : string
    sub_institution? : string
    position? : string
}


export const getAllContacts = () => {
    const config = {
        url: `${apiServerUrl}/api/contacts`,
        method: "GET"
    }
    return callAndGetResult(config)
}
