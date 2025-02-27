import {callAndGetResult} from "../shared/ExternalApiService";
import {apiServerUrl} from "../../Constants";
import {IContact} from "../../../pages/main/ContactsPage/ContactsPage";

export const getAllContacts = () => {
    const config = {
        url: `${apiServerUrl}/api/contacts`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export const newContact = (data : IContact, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/contact/new`,
        method: "POST",
        data : data,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    return callAndGetResult(config)
}

export const deleteContactById = (id : number, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/contact/${id}/delete`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    return callAndGetResult(config)
}