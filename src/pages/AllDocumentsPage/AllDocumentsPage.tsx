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
import Document from "../../components/Document/Document";
import {IDocument, IDocumentGroup} from "../../API/services/InstitutionService";

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






const AllDocumentsPage = () => {

    const [documentsGroups, setDocumentsGroups] = useState<MenuProps['items']>([]);
    const [documents, setDocuments] = useState<IDocument[]>([])
    const [docMap] = useState<Map<number, IDocument[]>>(new Map<number, IDocument[]>())
    const [documentUrl, setDocumentUrl] = useState<string | null>(null);
    function objToMenuItems(groups : IDocumentGroup[]) : MenuProps['items'] {
        let arr : MenuProps['items'] = []

        // for (let i = 0; i < groups.length; i++) {
        //     let itemKey =  "group-"+ groups[i].id
        //     arr.push(
        //         getItem(
        //             groups[i].title,
        //             itemKey,
        //             <SettingOutlined />,
        //             groups[i].subGroups.map(
        //                 (subGroup) => getItem(subGroup.title, "group-"+ subGroup.id)
        //             )
        //         )
        //     )
        // }
        return arr;
    }

    useEffect(() => {
        const getGroups = async () => {
            const {data, error} = await getAllDocumentsGroups();
            if (data) {
                const ar = objToMenuItems(data as IDocumentGroup[]);
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
            const docList : IDocument[] | undefined = docMap.get(subGroupId);
            if (docList) {
                setDocuments(docList)
            }
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
                    {documents.map((doc) =>
                        <Document document={doc} onClick={onSelectDocument}/>
                    )}
                </Flex>

                {documentUrl != null &&
                    <DocumentViewer
                        queryParams="hl=Nl"
                        url={documentUrl}
                        // viewerUrl={selectedViewer.viewerUrl}
                        style={{height: "75vh", width: "100%", maxWidth: 850}}
                    />
                }
            </Flex>
        </Flex>
    );
};

export default AllDocumentsPage;