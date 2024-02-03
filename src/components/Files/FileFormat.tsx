import React, {CSSProperties, FC} from 'react';
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
    style : CSSProperties
}

const FileFormat: FC<FileFormatProps> = ({format, style}) => {
    return (
        <Flex gap={5} >
            {(() => {
                switch (format) {
                    case "pdf" : return <FilePdfOutlined style={style}/>
                    case "gif" : return  <FileGifOutlined style={style}/>
                    case "zip" : return <FileZipOutlined style={style}/>
                    case "word" : return  <FileWordOutlined style={style}/>
                    case "xlsx" : return  <FileExcelOutlined style={style} />
                    case  "png" || "webp" : return <FileImageOutlined  style={style}/>
                    case "jpg" : return <FileJpgOutlined style={style} />
                    default : return  <FileOutlined style={style}/>
                }
            })()}
        </Flex>
    );
};

export default FileFormat;