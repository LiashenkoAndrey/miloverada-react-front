import React, {FC} from 'react';

import fileClasses from "./File.module.css"
import {Flex} from "antd";
import {MessageFile} from "../../../API/services/forum/MessageDto";
import File from "./File";

interface FileProps {
    messageFiles: MessageFile[]
}

const FileList: FC<FileProps> = ({messageFiles}) => {

    return (
        <Flex vertical className={fileClasses.fileList}>
            {messageFiles.map((messageFile) =>
                <File
                    key={"messageFile-" + messageFile.id}
                    fileSize={messageFile.file.size}
                    fileIsLarge={messageFile.file.isLarge}
                    fileName={messageFile.file.name}
                    fileFormat={messageFile.file.format}
                    mongoFileId={messageFile.file.mongoFileId}
                    messageFileId={messageFile.id}
                />
            )}
        </Flex>
    );
};

export default FileList;