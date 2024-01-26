import React, {FC} from 'react';
import {Flex} from "antd";
import {
    FileExcelOutlined,
    FileGifOutlined,
    FileImageOutlined,
    FileJpgOutlined,
    FileOutlined,
    FilePdfOutlined,
    FileWordOutlined,
    FileZipOutlined
} from "@ant-design/icons";

interface FileFormatProps {
    format : string
}

const FileFormat: FC<FileFormatProps> = ({format}) => {

    return (
        <Flex gap={5} >
            {(() => {
                switch (format) {
                    case "pdf" : return <FilePdfOutlined style={{fontSize: 32, color: "white"}}/>
                    case "gif" : return  <FileGifOutlined style={{fontSize: 32, color: "white"}}/>
                    case "zip" : return <FileZipOutlined style={{fontSize: 32, color: "white"}}/>
                    case "word" : return  <FileWordOutlined style={{fontSize: 32, color: "white"}}/>
                    case "xlsx" : return  <FileExcelOutlined style={{fontSize: 32, color: "white"}} />
                    case  "png" || "webp" : return <FileImageOutlined  style={{fontSize: 32, color: "white"}}/>
                    case "jpg" : return <FileJpgOutlined style={{fontSize: 32, color: "white"}} />
                    default : return  <FileOutlined style={{fontSize: 32, color: "white"}}/>
                }
            })()}
        </Flex>
    );
};

export default FileFormat;