import React, {FC, useCallback, useContext, useEffect, useState} from 'react';
import {
    Button,
    Checkbox,
    CheckboxProps,
    Dropdown,
    Flex,
    MenuProps,
    message,
    Modal,
    Typography
} from "antd";
import {
    CopyFilled,
    DownloadOutlined,
    InfoCircleOutlined,
    ShareAltOutlined
} from "@ant-design/icons";
import {IDocument} from "../../API/services/InstitutionService";
import FileFormat from "../Files/FileFormat";
import classes from './Document.module.css'
import {apiServerUrl, DOCUMENT_DOWNLOAD_PATH} from "../../API/Constants";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {updateAdminMeta} from "../../API/services/UserService";
import {AuthContext} from "../../context/AuthContext";
import {useActions} from "../../hooks/useActions";
import {setAdminMetadata} from "../../store/actionCreators/user";
import {useAuth0} from "@auth0/auth0-react";
import {checkPermission} from "../../API/Util";

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
    const {adminMetadata} = useTypedSelector(state => state.user)
    const {jwt} = useContext(AuthContext)
    const {setAdminMetadata} = useActions()

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


    const [isNotShowConfirm, setIsNotShowConfirm] = useState(true)

    const onOkDelete = useCallback(() => {
        if (!isNotShowConfirm) {
            console.log("Update !!!")
        }
    }, [isEditing]);

    const onChange: CheckboxProps['onChange'] = (e) => {
        setIsNotShowConfirm(e.target.checked)
    };
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false)

    const onSelectAction: MenuProps['onClick'] = ({ key }) => {
        const values = key.split("-")
        const action = values[2]

        switch (action) {
            case "editName" :
                setIsEditing(true)
                break;
            case 'delete':
                if (adminMetadata) {
                    if (adminMetadata.isShowConfirmWhenDeleteDocument) {
                        console.log("show")
                        setIsConfirmModalOpen(true)
                    }
                }
                if (onDeleteDocument) {
                    onDeleteDocument(document)
                } else throw new Error("On delete document callback not present!!!!")
                break;
            case 'show':
                break;
            default :
                console.error("def")
        }
    }


    const onDelete = async () => {
        setIsConfirmModalOpen(false)
        if (onDeleteDocument) {
            onDeleteDocument(document)
        }
        if (adminMetadata && jwt) {
            adminMetadata.isShowConfirmWhenDeleteDocument = false
            const {data, error} = await updateAdminMeta(adminMetadata,  jwt)
            if (data) {
                console.log("ok")
            }
            setAdminMetadata(adminMetadata)
            if (error) console.error(error);
        }
    }

    function getDocumentDownloadUrl(document: IDocument) {
        return DOCUMENT_DOWNLOAD_PATH.formatted(document.name)
    }

    function onShare(document: IDocument) {
        message.success("Посилання скопійовано")
        navigator.clipboard.writeText(getDocumentDownloadUrl(document))
    }

    return (
        <Dropdown disabled={!checkPermission(jwt, "admin")}  menu={{items : items , onClick: onSelectAction}} trigger={['contextMenu']}>
            <Flex key={"document-" + document.id}
                  className={classes.document}
                  align={"center"} gap={10}
            >
                <Modal onOk={onDelete} open={isConfirmModalOpen}
                       title={<span><InfoCircleOutlined style={{color: "#cb771c", fontSize: 20}} /> Ви впевнені? Дія незворотня.</span> }
                       onCancel={() => setIsConfirmModalOpen(false)}
                >
                    <Checkbox onChange={onChange}>Не нагадувати мені знову</Checkbox>
                </Modal>
                <FileFormat  style={{fontSize: 30, color: "#820000"}} format={fileFormat}/>

                <Flex onClick={() => onClick(document)} ref={documentEditNameInputRef}  style={{width: "100%"}}>

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

                <ShareAltOutlined onClick={() => onShare(document)} style={{fontSize: 30, cursor: "pointer"}} />
            </Flex>
        </Dropdown>

    );
};

export default Document;