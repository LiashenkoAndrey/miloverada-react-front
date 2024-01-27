import {apiServerUrl} from "../../Constants";
import axios from "axios";
import {MessageFileDtoSmall} from "./MessageDto";
import {MenuProps} from "antd";
import {callAndGetResult} from "../ExternalApiService";

export const saveMessageFile = (files : File, messageId : number, chatId : number, token : string) => {
    const formData = new FormData();
    formData.append('file',files)

    axios.post(`${apiServerUrl}/api/protected/forum/chat/${chatId}/message/${messageId}/file`, formData, {
        headers : {
            Authorization : `Bearer ${token}`
        }
    })
}

export const deleteMessageFile = (messageFileId : number, token : string) => {
    const config = {
        url: `${apiServerUrl}/api/protected/forum/message/file/${messageFileId}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    return callAndGetResult(config)
}

export const fileToDto = (fileList : File[]) : MessageFileDtoSmall[] => {
    return fileList.map((file) => {
        console.log("file", file.name, file.type)
        const dto : MessageFileDtoSmall = {
            name : file.name,
            size : file.size,
            format : file.name.substring(file.name.lastIndexOf(".") + 1)
        };

        return dto;
    })
}

export const getFileMenuItems = (messageFileId : number | undefined): MenuProps['items']  => {
    if (messageFileId !== undefined) {
        return [{
            label: 'Видалити файл',
            key: 'deleteFile-' + messageFileId,
            danger: true
        }]
    }
    return []
}

