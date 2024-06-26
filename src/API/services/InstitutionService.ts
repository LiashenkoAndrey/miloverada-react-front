import {apiServerUrl} from "../Constants";
import {callAndGetResult} from "./ExternalApiService";
import {IContact} from "../../pages/ContactsPage/ContactsPage";

export interface IInstitution {
    id : number
    title : string
    iconUrl : string
    document_group : IDocumentGroup[]
    employee_list : IContact[]
}



export interface IDocumentGroup {
    id : number
    name : string
    documents : IDocument[]
    groups : IDocumentGroup[]
    createdOn : string
}

export interface IDocument {
    id : number
    title : string
    name : string
    documentGroup : IDocumentGroupDto
}

export interface IDocumentGroupDto {
    id : number
    name : string
    documentGroup : IDocumentGroupDto
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
