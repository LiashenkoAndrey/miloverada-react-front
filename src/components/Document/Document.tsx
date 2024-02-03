import React, {FC} from 'react';
import {Flex} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import {IDocument} from "../../API/services/InstitutionService";
import FileFormat from "../Files/FileFormat";

interface DocumentProps {
    document : IDocument
    onClick : (fileName : string) => void
}


const Document:FC<DocumentProps> = ({document, onClick}) => {
    const fileFormat = document.name.substring(document.name.lastIndexOf('.') +1, document.name.length)

    return (
        <Flex key={"document-" + document.id}
              onClick={() => onClick(document.title)}
              align={"center"} gap={10}
        >
            <FileFormat style={{fontSize: 30, color: "black"}} format={fileFormat}/>
            <span style={{fontSize: 16}}  >{document.title}</span>
            <DownloadOutlined style={{fontSize: 30, cursor: "pointer"}}  />
        </Flex>
    );
};

export default Document;