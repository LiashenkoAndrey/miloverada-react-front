import React, {useContext, useEffect, useRef, useState} from 'react';

import {
    Button,
    Divider, Dropdown,
    Flex,
    InputNumber,
    List, MenuProps,
    Modal,
    notification, Popconfirm,
    Skeleton,
    Tour,
    TourProps,
    Typography
} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {IDocument, IDocumentGroup} from "../../API/services/InstitutionService";
import {
    deleteDocument,
    deleteSubGroup,
    getDocumentGroupById,
    updateDocument,
    updateSubGroup
} from "../../API/services/DocumentService";
import classes from './DocumentPage.module.css'
import BackBtn from "../../components/BackBtn/BackBtn";
import Document from "../../components/Document/Document";
import DocumentsViewer from "../../components/DocumentsViewer/DocumentsViewer";
import {CopyFilled, DownloadOutlined, InfoCircleOutlined, InfoOutlined, SettingOutlined} from "@ant-design/icons";
import AddNewGroupModal from "./AddNewSubGroupModal";
import {AuthContext} from "../../context/AuthContext";
import {Accordion} from "react-bootstrap";
import AddNewDocumentModal from "./AddNewDocumentModal";
import Groups from "./Groups";


// @ts-ignore
import getGroupOptionImg from '../../assets/tour-documents-getGroupOptions.jpg'
// @ts-ignore
import groupOptionsImg from '../../assets/tour-documents-groupOptions.jpg'
// @ts-ignore
import editTextBtnImg from '../../assets/tour-documents-editTextBtn.jpg'
// @ts-ignore
import editTextInputImg from '../../assets/tour-documents-editTextInput.png'
import {useAuth0} from "@auth0/auth0-react";
import {apiServerUrl} from "../../API/Constants";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {updateAdminMeta} from "../../API/services/UserService";
import {useActions} from "../../hooks/useActions";

const {  Title } = Typography;
const DocumentPage = () => {

    const {id, subGroupId} = useParams()
    const [selectedGroupId, setSelectedGroupId] = useState<number>()
    const [documentGroup, setDocumentGroup] = useState<IDocumentGroup>()
    const [groups, setGroups] = useState<IDocumentGroup[]>([])
    const [docs, setDocs] = useState<IDocument[]>([])
    const {isAuthenticated} = useAuth0()
    const [fileNameFontSize, setFileNameFontSize] = useState<number>(16)
    const {jwt} = useContext(AuthContext)
    const [selectedDocument, setSelectedDocument] = useState<IDocument>();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [editGroupId, setEditGroupId] = useState<number>()
    const [isNewDocumentModalActive, setIsNewDocumentModalActive] = useState<boolean>(false)
    const [newName, setNewName] = useState<string>()
    const {adminMetadata, appUser} = useTypedSelector(state => state.user)
    const {setAdminMetadata} = useActions()

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedDocument(undefined);
    };

    const onShowDocument = (document : IDocument) => {
        setSelectedDocument(document)
        setIsModalOpen(true)
    }

    const getById = async () => {
        const {data, error} = await getDocumentGroupById(Number(id))
        if (data) {
            const group : IDocumentGroup = data
            setDocumentGroup(group)
            setDocs(group.documents)
            setGroups(group.groups)
        }
        if (error) throw error
    }

    const onSelectAction = (action : string, groupId : number) => {
        switch (action) {
            case "editName" :
                setEditGroupId(Number(groupId))
                break;
            case 'delete':
                deleteGroupById(Number(groupId))
                break;
            case 'addDoc':
                setSelectedGroupId(Number(groupId))
                setIsNewDocumentModalActive(true)
                break;
            default : console.error("default case, onSelectAction method")
        }
    };

    const deleteGroupById = async (groupId : number) => {
        if (jwt) {
            const {data} = await deleteSubGroup(groupId, jwt)
            if (data) {
                if (groupId === Number(id)) return

                const arr = groups.filter((e) => e.id !== groupId)
                setGroups(arr)
            }
        } else notification.error({message: "not auth"})
    }


    const updateGroupName = async (name : string, id : number, callback :  (name : string) => void) => {
        const formData = new FormData()
        formData.append("name", name)
        if (jwt) {
            const {data, error} = await updateSubGroup(formData, id, jwt)
            if (data) {
                callback(name)
            }
            if (error) throw error
        } else notification.error({message: "not auth"})

        setEditGroupId(undefined)
    }

    const editSubGroupNameCallback = (name : string) => {
        const found  = groups.find((e) => e.id === editGroupId)
        if (found) {
            const i = groups.indexOf(found)
            found.name = name
            groups[i] = found
            setGroups(groups)
        }
    }


    const editGroupNameCallback = (name : string) => {
        if (documentGroup) {
            documentGroup.name = name
            setDocumentGroup(Object.create(documentGroup))
        }
    }


    const updateDocumentName = async (name : string, document : IDocument) => {
        const formData = new FormData()
        formData.append("name", name)
        if (jwt) {
            const {data, error} = await updateDocument(formData, document.id, jwt)
            if (data) {
                updDocument(name, document)
            }
            if (error) throw error
        } else notification.error({message: "not auth"})

        setEditGroupId(undefined)
    }


    const updDocument = (name : string, document : IDocument) => {
        console.log(document)
        if (document.documentGroup.id ===  Number(id)) {
            const doc = docs.find((d) => d.id === document.id)
            if (doc) {
                const i = docs.indexOf(doc)
                doc.title = name
                docs[i] = doc
                setDocs([...docs])
            }
        } else {
            let foundGroup = groups.find((e) => {
                const elem = e.documents.find((d) => d.id === document.id)
                return elem !== undefined
            });

            if (foundGroup) {
                const doc = foundGroup.documents.find((d) => d.id === document.id)
                if (doc) {
                    const i = foundGroup.documents.indexOf(doc)
                    doc.name = name
                    foundGroup.documents[i] = doc
                    groups[groups.indexOf(foundGroup)] = foundGroup
                    setGroups([...groups])
                }
            }
        }
    }


    const removeDocument = (document : IDocument) => {
        if (document.documentGroup.id === Number(id)) {
            if (documentGroup) {
                const arr = docs.filter((e) => e.id !== document.id)
                setDocs(arr)
            }
        } else {
            const foundGroup = groups.find((e) => {
                return e.documents.find((doc) => doc.id === document.id)
            });
            if (foundGroup) {
                foundGroup.documents = foundGroup.documents.filter((e) => e.id !== document.id)
                groups[groups.indexOf(foundGroup)] = foundGroup
                setGroups([...groups])
            } else console.error("group not found")
        }
    }

    const onDeleteDocument = async (document : IDocument) => {
        if (jwt) {
            const {data, error} = await deleteDocument(document.id, jwt)
            if (data) {
                removeDocument(data)
            }
            if (error) {
                console.error("can't delete document", document)
                notification.error({message: "can't delete document"})
            }

        } else notification.error({message: "not auth"})
    }

    const [isUpdated, setIsUpdated] = useState<boolean>(false)

    useEffect(  () => {
        if (newName && editGroupId) {
            updateGroupName(newName, editGroupId, editSubGroupNameCallback)
            setIsUpdated(true)
        }
    }, [ newName]);


    useEffect(() => {
        getById()
    }, []);

    const footer = selectedDocument && [
        <a key={"showDocFooterBtn-1"} href={apiServerUrl + "/api/download/file/" + selectedDocument.name}  style={{ textDecoration: "none"}}>
            <Button icon={<DownloadOutlined/>}>Завантажити</Button>
        </a> ,
        <Button key={"showDocFooterBtn-2"} type={"primary"} onClick={handleCancel}>Заразд</Button>
    ]


    const addNewSubGroup = async (subGroup : IDocumentGroup) => {
        setGroups([...groups, subGroup])
    }

    const setDoc = (doc : IDocument) => {
        if (selectedGroupId === Number(id) ) {
            setDocs([...docs, doc])
        } else {
            if (selectedGroupId) {
                const group = groups.find((e) => e.id === selectedGroupId)
                if (group) {
                    group.documents.push(doc)
                    setGroups([...groups])
                }
            }
        }
    }

    useEffect(() => {
       if (adminMetadata) {
           setIsTourModalOpen(adminMetadata.isShowModalTourWhenUserOnDocumentsPage)
       }
    }, [adminMetadata]);


    useEffect(() => {
        setIsModalOpen(false)
    }, []);

    const handleOk2 = () => {
        setIsTourActive(true)
        setIsTourModalOpen(false);
    };

    const onSkipTour = async () => {
        setIsTourModalOpen(false);
        if (adminMetadata && jwt) {
            adminMetadata.isShowModalTourWhenUserOnDocumentsPage = false
            const {data, error} = await updateAdminMeta(adminMetadata,  jwt)
            if (data) {
                console.log("ok")
            }
            setAdminMetadata(adminMetadata)
            if (error) console.error(error);
        }
    };

    const [isTourModalOpen, setIsTourModalOpen] = useState(false);
    const mainGroupRef = useRef(null);
    const groupsRef = useRef(null);
    const newGroupRef = useRef(null);
    const addDocBtnRef = useRef(null);
    const fontRef = useRef(null);
    const groupRef = useRef(null);
    const documentEditNameInputRef = useRef(null);


    const steps: TourProps['steps'] = [
        {
            title: 'Групи та підгрупи',
            description:(
                <p>
                    Всі документи розподідені на групи, у кожної групи може бути підгрупа. <strong>Щоб змінити назву групи, натисніть на текст</strong>
                </p>

            ),
            target: () => mainGroupRef.current,
        },
        {
            title: 'Як додати групу',
            description : "Натисніть на цю кнопку щоб додати нову групу",
            target: () => newGroupRef.current,
        },
        {
            title: 'Як збільшити шрифт',
            description : "Всі користувачі можуть збільшувати або зменшувати шрифт",
            target: () => fontRef.current,
        },
        {
            title: 'Керування документами',
            description: (
                <p>
                    Щоб додати новий документ, змінити назву або видалити підгрупу, <strong>наведіть курсор на підгрупу та натисніть праву кнопку миші.</strong>
                </p>
            ),
            target: () => groupRef.current,
            cover: (
                <Flex>
                    <img style={{width: "150%", height: 'auto'}} src={getGroupOptionImg} alt={getGroupOptionImg}/>
                    <img style={{ height: "auto", width: "100%"}}  src={groupOptionsImg} alt={'groupOptionsImg'}/>
                </Flex>
            ),
        },
        {
            title: 'Як змінити текст підгрупи/документу',
            description: (
                <p>
                    Натисніть на відповідну кнопку в контекстному меню. <strong>Для підтвердження натисніть Enter, для відміни ESC</strong>
                </p>
            ),
            cover : (
                <Flex>
                    <img style={{width: "100%", height: 'auto'}} src={editTextBtnImg} alt={'editTextBtnImg'}/>
                    <img style={{width: "100%", height: 'auto'}} src={editTextInputImg} alt={'editTextInputImg'}/>
                </Flex>
            ),
            target: () => groupRef.current,
            nextButtonProps: {
                onClick: async () => {
                    setIsTourActive(false)
                    setIsNewDocumentModalActive(true)
                    setIsAddDocTourActive(true)

                    if (adminMetadata && jwt) {
                        if (adminMetadata.isShowModalTourWhenUserOnDocumentsPage) {
                            adminMetadata.isShowModalTourWhenUserOnDocumentsPage = false
                            adminMetadata.isDocumentsPageTourCompleted = true
                            const {data, error} = await updateAdminMeta(adminMetadata,  jwt)

                            if (data) {
                                console.log("ok")
                            }
                            setAdminMetadata(adminMetadata)
                            if (error) console.error(error);
                        }
                    }
                }
            }
        },

    ];


    const [isTourActive, setIsTourActive] = useState(false)
    const [isAddDocTourActive, setIsAddDocTourActive] = useState<boolean>(false);
    const [newGroupName, setNewGroupName] = useState<string>('')

    useEffect(() => {
        if (newGroupName) {
            updateGroupName(newGroupName, Number(id), editGroupNameCallback)
        }
    }, [newGroupName]);


    const onAddGroupDocument = () => {
        setSelectedGroupId(Number(id))
        setIsNewDocumentModalActive(true)
    }

    const nav = useNavigate()

    const onDeleteGroup = async () => {
        setIsDeletingGroup(true)
        await deleteGroupById(Number(id))
        setIsDeletingGroup(false)
        nav("/documents/all")
    }

    const [isDeletingGroup, setIsDeletingGroup] = useState<boolean>(false)

    const items: MenuProps['items'] = [{
            key: '1',
            label: (
                <span onClick={() => setIsTourActive(true)}>Пройти екскурсію</span>
            ),
        }]

    const tourModalFooter = [
        <Button key={"tourModalFooter1"} onClick={onSkipTour}>Пропустити</Button> ,
        <Button key={"tourModalFooter2"} type={"primary"}  onClick={handleOk2}>Гаразд</Button>
    ]

    return (
        <Flex justify={"center"}>
            <Modal title="Вітаємо!"
                   open={isTourModalOpen}
                   footer={tourModalFooter}
                   onCancel={onSkipTour}
            >
                <p>Схоже ви вперше на цій сторінці як адміністратор, пропонуємо вам пройти екскурсію по основному фунціоналу</p>
                <p>Ви завжди можете пройти її знову</p>
            </Modal>
            <Tour open={isTourActive} onClose={() => setIsTourActive(false)} steps={steps} />

            <Flex vertical className={classes.documentGroupPage}>
                <BackBtn/>

                <Flex style={{padding: 5}} justify={"space-between"} align={"center"} wrap={"wrap"} gap={5}>
                    {documentGroup
                        ?
                        <Title ref={mainGroupRef} style={{margin: 0, flexGrow: 1}}
                                   editable={{
                                       triggerType : ['text'],
                                       icon: <CopyFilled style={{display: "none"}}/>,
                                       onChange: (str: string) => setNewGroupName(str)
                                   }}
                        >{documentGroup.name}
                        </Title>
                        :
                        <Skeleton style={{height: 20}}/>
                    }
                    <Flex wrap={"wrap"} gap={15} align={"center"}>

                        <Flex ref={fontRef} gap={5} align={"center"}>

                            <InputNumber value={fileNameFontSize}
                                         onChange={(e) => setFileNameFontSize(e ? e : 16)}
                                         min={14}
                                         max={35}
                                         style={{height: "fit-content"}}
                                         defaultValue={fileNameFontSize}
                            />
                            <span>Шрифт</span>
                        </Flex>
                        {isAuthenticated &&
                            <Flex gap={3}>
                                <AddNewGroupModal newGroupRef={newGroupRef}
                                                  addGroup={addNewSubGroup}
                                                  groupId={Number(id)}
                                />

                                <Button ref={addDocBtnRef} onClick={onAddGroupDocument}>Додати документ</Button>
                                <Popconfirm
                                    title="Видалити"
                                    description="Ви впевнені? Дія незворотня."
                                    onConfirm={onDeleteGroup}
                                    okButtonProps={{loading: isDeletingGroup}}
                                >
                                    <Button danger>Видалити групу</Button>
                                </Popconfirm>


                                <Dropdown  trigger={["click"]} menu={{ items }}>
                                    <Button icon={<InfoCircleOutlined />}/>
                                </Dropdown>

                            </Flex>

                        }
                    </Flex>
                </Flex>

                <Divider/>


                <Flex ref={groupsRef} gap={10} vertical style={{maxWidth: 1600}}>
                    <Accordion defaultActiveKey={subGroupId}>
                        {groups.map((group, i) =>
                            <Accordion.Item ref={i === 0 ? groupRef : null} key={group.id} eventKey={String(group.id)}>
                                <Groups fileNameFontSize={fileNameFontSize}
                                        setNewName={setNewName}
                                        editGroupId={editGroupId}
                                        onSelectAction={onSelectAction}
                                        group={group}
                                        isUpdated={isUpdated}
                                        setIsUpdated={setIsUpdated}

                                />

                                <Accordion.Body>
                                    {group.documents &&
                                        <List
                                            size="small"
                                            dataSource={group.documents}
                                            renderItem={(doc) =>
                                                (
                                                    <Document onClick={onShowDocument}
                                                              onEditName={updateDocumentName}
                                                              key={"doc-" + doc.id}
                                                              fontSize={fileNameFontSize}
                                                              document={doc}
                                                              onDeleteDocument={onDeleteDocument}
                                                              documentEditNameInputRef={documentEditNameInputRef}
                                                    />
                                                )}
                                        />

                                    }

                                </Accordion.Body>
                            </Accordion.Item>
                        )}
                    </Accordion>

                </Flex>
                <Flex vertical>
                    {docs.map((doc) =>
                        <Document onClick={onShowDocument}
                                  onEditName={updateDocumentName}
                                  key={"doc-" + doc.id}
                                  fontSize={fileNameFontSize}
                                  document={doc}
                                  onDeleteDocument={onDeleteDocument}
                        />
                    )}
                </Flex>
            </Flex>

            {selectedDocument &&
                <Modal width={"100vw"} title={selectedDocument.title} footer={footer} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <DocumentsViewer document={selectedDocument}/>
                </Modal>
            }
            <AddNewDocumentModal groupId={selectedGroupId}
                                 isActive={isNewDocumentModalActive}
                                 setIsActive={setIsNewDocumentModalActive}
                                 setDoc={setDoc}
                                 isTourActive={isAddDocTourActive}
                                 setIsAddDocTourActive={setIsAddDocTourActive}

            />
        </Flex>
    );
};

export default DocumentPage;