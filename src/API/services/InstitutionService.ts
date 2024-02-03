import {apiServerUrl} from "../Constants";
import {callAndGetResult} from "./ExternalApiService";
import {IEmployee} from "./ContactsService";

export interface IInstitution {
    id : number
    title : string
    iconUrl : string
    document_group : IDocumentGroup[]
    employee_list : IEmployee[]
}



export interface IDocumentGroup {
    id : number
    name : string
    documents : IDocument[]
}

export interface IDocument {
    id : number
    title : string
    name : string
}



export const getAllInstitutions = () => {
    const config = {
        url: `${apiServerUrl}/api/institution/all`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export const getInstitutionById = (id : number) => {
    const config = {
        url: `${apiServerUrl}/api/institution/${id}`,
        method: "GET"
    }
    return callAndGetResult(config)
}
