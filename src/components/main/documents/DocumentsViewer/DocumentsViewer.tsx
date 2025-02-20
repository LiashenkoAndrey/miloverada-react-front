import React, {FC} from 'react';
import {DocumentViewer} from "react-documents";
import {IDocument} from "../../../../API/services/main/DocumentService";

interface DocumentsViewerProps {
    document : IDocument
}

const DocumentsViewer: FC<DocumentsViewerProps> = ({document}) => {

    const style = {
        height: "70vh",
        width: "100%"
    }
    console.log(document.name)
    const name = "https://miloverada.gov.ua/upload/document/%D0%9A%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82%D0%B8%20%D0%97%D0%9E%20%20%D0%9C%D0%B8%D0%BB%D1%96%D0%B2%D1%81%D1%8C%D0%BA%D0%B0%20%D0%A2%D0%93%202023%D1%80%20.docx"
    const officeFiles = ['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx']
    console.log(name.lastIndexOf('.' + 1))
    const fileType = name.substring(name.lastIndexOf('.') + 1, name.length)
    console.log(fileType)

    return (
        <>
            {document &&
                <>
                    {officeFiles.includes(fileType)
                        ?
                        <DocumentViewer style={style}
                                        url={name}
                                        viewer={"office"}

                        />
                        :
                        <DocumentViewer style={style}
                                        viewerUrl={"https://docs.google.com/gview?url=%URL%&embedded=true"}
                                        url={name}
                                        viewer={"url"}

                        />
                    }
                </>
            }
        </>
    );
};

export default DocumentsViewer;