import React, {FC, useContext} from 'react';
import {App, Dropdown, Flex, MenuProps} from "antd";
import fileClasses from "./File.module.css";
import FileFormat from "./FileFormat";
import {formatFileSize, getFileUploadUrl} from "../../API/Util";
import {DownloadOutlined, LoadingOutlined} from "@ant-design/icons";
import {useAuth0} from "@auth0/auth0-react";
import {deleteMessageFile, getFileMenuItems} from "../../API/services/forum/MessageFileService";
import {useActions} from "../../hooks/useActions";
import {AuthContext} from "../../context/AuthContext";

interface FileProps {
    fileName : string,
    fileSize : number
    fileFormat : string
    messageFileId? : number
    fileIsLarge? : boolean
    mongoFileId? : string
}

const File: FC<FileProps> = ({fileIsLarge, fileSize, mongoFileId, messageFileId, fileName, fileFormat}) => {
    const {isAuthenticated} = useAuth0()
    const {setIsFileDropdownActive} = useActions()
    const {jwt} = useContext(AuthContext)
    const {notification} = App.useApp();
    const onSelectFileAction: MenuProps['onClick'] = ({key}) => {
        let arr = key.split("-")
        doAction(arr[0], Number(arr[1]))
    }

    const onDeleteFile = async (fileId : number) => {
        if (jwt) {
            const {data, error} = await deleteMessageFile(fileId, jwt);

            if (data) {
                notification.success({message: "Файл видалено"})
            }

            if (error) {
                notification.error({message: "Файл не вдалося видалити"})
            }
        }
    }

    async function doAction(action: string, messageFileId: number) {
        switch (action) {
            case 'deleteFile':
                onDeleteFile(messageFileId)
                break
        }
    }


    return (
        <Dropdown disabled={!isAuthenticated}
                    onOpenChange={(e) => {
                        setIsFileDropdownActive(e)
                    }}

                  menu={{items:  getFileMenuItems(messageFileId), onClick: onSelectFileAction}}
                  trigger={['contextMenu']}
        >
            <Flex gap={10}
                  align={"center"}
                  justify={"space-between"}
                  className={fileClasses.file}>
                <Flex gap={5} align={"center"}>

                    <FileFormat style={{fontSize : 32, color: "white"}} format={fileFormat}/>

                    <span className={fileClasses.fileName}>{fileName}</span>
                </Flex>

                <Flex gap={5} align={"center"}>

                    <span className={fileClasses.fileSize + " nonSelect"}>{formatFileSize(fileSize)}</span>

                    {mongoFileId !== undefined
                        ?
                        fileIsLarge !== undefined ?
                            <a download={fileName}
                               rel="noreferrer"
                               href={getFileUploadUrl(fileIsLarge, mongoFileId)}
                            >
                                <DownloadOutlined className={fileClasses.download}
                                                  style={{fontSize: 32, color: "rgba(255,255,255,0.65)"}}/>
                            </a>
                            :
                            <>err</>
                        :
                        <LoadingOutlined style={{fontSize: 32, color: "white"}}/>
                    }
                </Flex>
            </Flex>
        </Dropdown>
    );
};

export default File;