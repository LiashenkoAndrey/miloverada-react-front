import React, {FC} from 'react';

import fileClasses from "./File.module.css"
import {Flex} from "antd";
import File from "./File";
import {MessageFileDto} from "../../../API/services/forum/MessageDto";

interface FileDtoListProps {
    files: MessageFileDto[]
}

const FileDtoList: FC<FileDtoListProps> = ({files}) => {


    return (
        <Flex vertical className={fileClasses.fileList}>
            {files.map((file) =>
                <File
                    key={"fileDto-" + file.name}
                    fileFormat={file.format}
                    fileName={file.name}
                    fileSize={file.size}
                    mongoFileId={file.mongoId}
                    fileIsLarge={file.isLarge}
                />
            )
            }
        </Flex>
    );
};
export default FileDtoList;