import React, {FC} from 'react';
import {List} from "antd";
import Document from "../../../components/main/documents/Document/Document";
import {IDocument, IDocumentGroup} from "../../../API/services/main/DocumentService";

interface GroupDocumentsListProps {
  group: IDocumentGroup
  onClickOnDocumentText: (document : IDocument) => void
  updateDocumentName: (name : string, document : IDocument) => void
  fileNameFontSize: number
  onDeleteDocument?: (document: IDocument) => void
  documentEditNameInputRef?: React.MutableRefObject<null>
}

export const DIRECTIVE_GROUP_NAME = "Розпорядження"
export const DATE_PATTERN = /\b\d{2}\.\d{2}\.\d{4}\b/;
const GroupDocumentsList: FC<GroupDocumentsListProps> = ({
                                                           group,
                                                           fileNameFontSize,
                                                           updateDocumentName,
                                                           onClickOnDocumentText,
                                                           onDeleteDocument,
                                                           documentEditNameInputRef,
                                                         }) => {
    function sortByName(documents: IDocument[]) : IDocument[] {
        if (documents.length === 0) return [];

        let notSortedArray : IDocument[] = [];
        let filteredDocuments = documents.filter((e) => {
            if (!hasDate(e.title)) {
                notSortedArray.push(e)
                return false;
            }
            return true
        });
        if (filteredDocuments.length > 0 && filteredDocuments[0].title.includes(DIRECTIVE_GROUP_NAME)) {
            filteredDocuments = sortDirectiveGroupDocuments(filteredDocuments);
        }
        filteredDocuments.push(...notSortedArray)
        return filteredDocuments;
    }

    function sortDirectiveGroupDocuments(documents: IDocument[]) : IDocument[] {

        return documents.sort((a, b) => {
                let aName = a.title.match(DATE_PATTERN);
                let bName = b.title.match(DATE_PATTERN);
                if (aName == null || bName == null) {
                    console.error("No date", a.title, b.title)
                    return 0;
                }

                const aDate = new Date(aName[0].split('.').reverse().join('-'));
                const bDate = new Date(bName[0].split('.').reverse().join('-'));

                if (aDate < bDate) {
                    return 1; // a should come after b
                } else if (aDate > bDate) {
                    return -1; // b should come after a
                } else {
                    return 0; // Dates are equal
                }
            }
        )
    }

    function hasDate(str : string) {
        return str.match(DATE_PATTERN) !== null;
    }

    return (
      <List
          size="small"
          dataSource={sortByName(group.documents)}
          renderItem={(doc) =>
              (
                  <Document onClick={onClickOnDocumentText}
                            onEditName={updateDocumentName}
                            key={"doc-" + doc.id}
                            fontSize={fileNameFontSize}
                            document={doc}
                            onDeleteDocument={onDeleteDocument}
                            documentEditNameInputRef={documentEditNameInputRef}
                  />
              )}
      />
  );
};

export default GroupDocumentsList;