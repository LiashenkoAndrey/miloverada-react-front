import React, {FC} from 'react';
import {Flex} from "antd";
import {IDocumentGroup} from "../../API/services/InstitutionService";
import Document from "../Document/Document";

interface DocumentSubGroupProps {
    subGroup : IDocumentGroup
}
const DocumentSubGroup: FC<DocumentSubGroupProps> = ({subGroup}) => {
    return (
        <Flex key={"subGroup-" + subGroup.id}>
            {subGroup &&
                <Flex vertical>
                    <strong>{subGroup.name}</strong>
                    <Flex gap={5} vertical>
                        {subGroup.documents.map((doc) =>
                            <Document document={doc} onClick={(fileName) => console.log(fileName)}/>
                        )}
                    </Flex>
                </Flex>
            }
        </Flex>
    );
};

export default DocumentSubGroup;