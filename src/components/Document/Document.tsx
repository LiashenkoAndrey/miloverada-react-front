import React, {FC, useEffect, useRef, useState} from 'react';
import {Checkbox, Dropdown, Flex, MenuProps, Modal, Tour, Typography} from "antd";
import {CopyFilled, DownloadOutlined, EditOutlined} from "@ant-design/icons";
import {IDocument} from "../../API/services/InstitutionService";
import FileFormat from "../Files/FileFormat";
import classes from './Document.module.css'
import {apiServerUrl} from "../../API/Constants";
import type { TourProps } from 'antd';

const { Paragraph, Text, Title } = Typography;

interface DocumentProps {
    document : IDocument
    fontSize? : number
    onEditName? : (name : string, document : IDocument) => void
    onClick : (document : IDocument) => void
    onDeleteDocument? : (document: IDocument) => void
    documentEditNameInputRef? :  React.MutableRefObject<null>
}


const Document: FC<DocumentProps> = ({
                                         document,
                                         fontSize,
                                         onClick,
                                         onEditName,
                                         onDeleteDocument,
                                         documentEditNameInputRef
                                     }) => {
    const fileFormat = document.name.substring(document.name.lastIndexOf('.') + 1, document.name.length)

    const items: MenuProps['items'] = [
        {
            label: 'Переглянути',
            key: `doc-${document.id}-show`,
        },
        {
            label: 'Змінити назву',
            key: `doc-${document.id}-editName`,
        },
        {
            label: 'Видалити',
            key: `doc-${document.id}-delete`,
            danger : true
        }
    ];

    const [isEditing, setIsEditing] = useState<boolean>()
    const [newTitle, setNewTitle] = useState<string>('')
    const [oldVal, setOldVal] = useState<string>()

    useEffect(() => {
        if (newTitle) {
            setIsEditing(false)
        }
    }, [newTitle]);

    useEffect(() => {
        if (newTitle) {
            if (!oldVal) setOldVal(newTitle)

            if (onEditName !== undefined) {
                if (oldVal) {
                    if (oldVal !== newTitle) {
                        onEditName(newTitle, document)
                        setIsEditing(false)
                        setOldVal(newTitle)
                    }
                }  else {
                    onEditName(newTitle, document)
                    setIsEditing(false)
                }
            }
        }
    }, [newTitle]);


    const onSelectAction: MenuProps['onClick'] = ({ key }) => {
        const values = key.split("-")
        const id = values[1]
        const action = values[2]

        switch (action) {
            case "editName" :
                setIsEditing(true)
                break;
            case 'delete':

                if (onDeleteDocument !== undefined) {
                    Modal.confirm({
                        title : "Ви впевнені? Дія незворотня.",
                        content : (
                            <Checkbox  >Не нагадувати мені знову</Checkbox>
                        ),
                        onOk : () => onDeleteDocument(document)
                    })
                }
                break;
            case 'show':
                break;
            default : console.error("def")
        }
    }


    return (
        <Dropdown menu={{items : items , onClick: onSelectAction}} trigger={['contextMenu']}>
            <Flex key={"document-" + document.id}
                  className={classes.document}
                  align={"center"} gap={10}
            >
                <FileFormat style={{fontSize: 30, color: "#820000"}} format={fileFormat}/>

                <Flex ref={documentEditNameInputRef}  style={{width: "100%"}}>

                    <Paragraph style={{margin: 0, fontWeight : "initial", fontSize: fontSize ? fontSize : 16, width: "100%"}}
                               editable={{

                                   icon: <CopyFilled style={{display: "none"}}/>,
                                   editing: isEditing,
                                   onCancel: () => setIsEditing(false),
                                   onChange: (str: string) => setNewTitle(str)
                               }}
                    >{document.title}
                    </Paragraph>
                </Flex>

                <a href={apiServerUrl + "/api/download/file/" + document.name}  style={{ textDecoration: "none"}}>
                    <DownloadOutlined className={classes.downloadBtn} style={{fontSize: 30, cursor: "pointer"}}  />
                </a>
            </Flex>
        </Dropdown>

    );
};

export default Document;