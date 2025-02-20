import React, {FC} from 'react';
import {DownloadOutlined, LoadingOutlined} from "@ant-design/icons";
import {getFileUploadUrl} from "../../../API/Util";
import fileClasses from "./File.module.css";

interface DownloadFileBtnProps {
    mongoId : string | undefined
    isLarge : boolean | undefined
}
const DownloadFileBtn: FC<DownloadFileBtnProps> = ({mongoId, isLarge}) => {
    return (
        <>
            {mongoId === undefined
                ?
                <LoadingOutlined style={{fontSize: 32, color: "#3b4146"}}  />
                :

                <a href={getFileUploadUrl(isLarge, mongoId)}>
                    <DownloadOutlined className={fileClasses.download} style={{fontSize: 32, color: "#3b4146"}}  />
                </a>
            }
        </>
    );
};

export default DownloadFileBtn;