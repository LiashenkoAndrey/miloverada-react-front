import {callAndGetResult} from "../shared/ExternalApiService";

const apiServerUrl = process.env.REACT_APP_API_SERVER_URL;

export const getAllDocumentsGroups = () => {
    const config = {
        url: `${apiServerUrl}/api/documentGroup/all`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export const getDocumentGroupById = (id : number) => {
    const config = {
        url: `${apiServerUrl}/api/documentGroup/id/${id}`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export const searchDocuments = (str : string) => {
    const config = {
        url: `${apiServerUrl}/api/documents/search?docName=${str}`,
        method: "GET"
    }
    return callAndGetResult(config)
}

export const addNewSubGroup = (data : FormData, groupId : number | null, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/documentGroup/new` + (groupId ? "?groupId=" + groupId : ""),
        method: "POST",
        data : data,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    return callAndGetResult(config)
}

export const updateSubGroup = (data : FormData, groupId : number, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/documentGroup/${groupId}/update`,
        method: "PUT",
        data : data,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    return callAndGetResult(config)
}

export const updateDocument = (data : FormData, documentId : number, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/document/${documentId}/update`,
        method: "PUT",
        data : data,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    return callAndGetResult(config)
}

export const deleteDocument = (docId : number, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/document/${docId}/delete`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    return callAndGetResult(config)
}

export const addNewDocumentInSubGroup = (data : FormData, groupId : number, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/documentGroup/${groupId}/document/new`,
        method: "POST",
        data : data,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    return callAndGetResult(config)
}

export const deleteSubGroup = (groupId : number, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/documentGroup/${groupId}/delete`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    return callAndGetResult(config)
}

export interface IDocumentGroup {
    id : number
    name : string
    documents : IDocument[]
    groups : IDocumentGroup[]
    createdOn : string
    order : number
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