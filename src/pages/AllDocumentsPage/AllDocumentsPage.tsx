import React, {useEffect, useState} from 'react';
import {DownloadOutlined, FilePdfOutlined, SettingOutlined} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Button, Flex, Image, Menu} from 'antd';
import {getAllDocumentsBySubGroupId, getAllDocumentsGroups} from "../../API/services/DocumentService";
import {DocumentViewer} from 'react-documents';
// @ts-ignore
import expandArrow from '../../assets/arrows-expand-svgrepo-com.svg';
// @ts-ignore
import collapseArrow from '../../assets/arrows-collapse-svgrepo-com.svg';

type MenuItem = Required<MenuProps>['items'][number];
function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}


interface SubGroup {
    id: number,
    title : string
}

interface DocumentGroup {
    id: number,
    title : string,
    subGroups : Array<SubGroup>
}


interface Document {
    id : number,
    title : string,
    document_filename : string
}

const AllDocumentsPage = () => {

    const [documentsGroups, setDocumentsGroups] = useState<MenuProps['items']>([]);
    const [documents, setDocuments] = useState<Array<Document>>()
    const [docMap] = useState<Map<number, Array<Document>>>(new Map<number, Array<Document>>())
    const [documentUrl, setDocumentUrl] = useState<string | null>(null);
    function objToMenuItems(groups : Array<DocumentGroup>) : MenuProps['items'] {
        let arr : MenuProps['items'] = []

        for (let i = 0; i < groups.length; i++) {
            let itemKey =  "group-"+ groups[i].id
            arr.push(
                getItem(
                    groups[i].title,
                    itemKey,
                    <SettingOutlined />,
                    groups[i].subGroups.map(
                        (subGroup) => getItem(subGroup.title, "group-"+ subGroup.id)
                    )
                )
            )
        }
        return arr;
    }

    useEffect(() => {
        const getGroups = async () => {
            const {data, error} = await getAllDocumentsGroups();
            if (data) {
                const ar = objToMenuItems(data as Array<DocumentGroup>);
                console.log(ar)
                setDocumentsGroups(ar);
            }
            if (error) throw error
        }

        getGroups()
    }, []);

    // let docMap = new Map<number, Array<Document>>();

    const getDocuments = async (id : number) => {
        const {data, error} = await getAllDocumentsBySubGroupId(id);
        if (data) {
            setDocuments(data)
            docMap.set(id, data);
        }
        if (error) throw error
    }

    const onClick: MenuProps['onClick'] = (e) => {
        console.log("here")
        // Subgroup id contains in key value of a menu element in format 'group-id'
        const subGroupId = Number(e.key.substring(e.key.indexOf("-") + 1, e.key.length));
        if (docMap.has(subGroupId)) {
            setDocuments(docMap.get(subGroupId))
        }
        else {
            getDocuments(subGroupId);
        }
    };

    const onSelectDocument = (filename : string) => {
        console.log(filename)
        setDocumentUrl("https://miloverada.gov.ua/upload/document/" + filename)
    }


    return (
        <Flex align={"flex-start"} justify={"center"} style={{paddingTop: "20vh", minHeight: "100vh", backgroundColor: "rgb(249, 246, 239)"}}>
            <Flex style={{maxWidth: "90vw", width: "100%"}} gap={30} wrap={ "wrap"}>
                <Flex vertical={true} className={"menuWrapper"} gap={5}>
                    <Flex justify={"flex-end"} align={"center"} className={"toolMenu"}>
                        <Button  ghost  style={{height: "fit-content", width: "fit-content"}} icon={<Image width={25} height={25} preview={false} src={collapseArrow}/>}/>
                        <Button ghost style={{height: "fit-content", width: "fit-content"}} icon={<Image width={25} height={25} preview={false} src={expandArrow}/>}/>
                    </Flex>
                    <Menu
                        onClick={onClick}
                        style={{ width: 256 }}
                        mode="inline"
                        items={documentsGroups}
                    />
                </Flex>

                <Flex vertical={true} gap={3} style={{maxWidth: 500, overflowY: "auto", maxHeight: 500, minWidth: 300}}>
                    {documents
                        ?
                        documents.map((doc) =>
                            <Flex onClick={() => onSelectDocument(doc.document_filename)} align={"center"} gap={10} style={{height: "fit-content", backgroundColor: "rgba(38,38,38,0.16)", padding: 5}}>
                                <FilePdfOutlined style={{fontSize: 30}} />
                                <span style={{fontSize: 16}}  >{doc.document_filename}</span>
                                <DownloadOutlined style={{fontSize: 30, cursor: "pointer"}}  />
                            </Flex>)
                        :
                        <></>
                    }
                </Flex>

                {documentUrl != null
                    ?
                    <DocumentViewer
                        queryParams="hl=Nl"
                        url={documentUrl}
                        // viewerUrl={selectedViewer.viewerUrl}
                        style={{height: "75vh", width: "100%", maxWidth: 850}}
                    />
                    :
                    <></>
                }


            </Flex>
        </Flex>
    );
};

export default AllDocumentsPage;