import React, {useContext, useEffect, useState} from 'react';
import {Button, Divider, Flex} from 'antd';
import {
  getAllDocumentsGroups, IDocument,
  IDocumentGroup,
  searchDocuments
} from "../../../API/services/main/DocumentService";
import classes from './AllDocumentsPage.module.css'
import BackBtn from "../../../components/main/BackBtn/BackBtn";
import Search from "antd/es/input/Search";
import {useNavigate} from "react-router-dom";
import {SearchProps} from "antd/lib/input";
import Document from "../../../components/main/documents/Document/Document";
import AddNewGroupModal from "../DocumentPage/AddNewSubGroupModal";
import {checkPermission} from "../../../API/Util";
import {AuthContext} from "../../../context/AuthContext";

const AllDocumentsPage = () => {

  const [documentsGroups, setDocumentsGroups] = useState<IDocumentGroup[]>([]);
  const nav = useNavigate()
  const [searchedDocs, setSearchedDocs] = useState<IDocument[][] | null>(null)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const {jwt} = useContext(AuthContext)

  const getDocumentsGroups = async () => {
    const {data, error} = await getAllDocumentsGroups();
    if (data) {
      setDocumentsGroups(data)
    }
    if (error) throw error
  }

  useEffect(() => {
    getDocumentsGroups()
  }, []);


  const onSearchDocument: SearchProps['onSearch'] = async (value) => {
    if (value === '') {
      setSearchedDocs(null)
      return
    }
    setIsSearching(true)
    const {data, error} = await searchDocuments(value)
    if (data) {
      setIsSearching(false)
      const res = sort(data)

      setSearchedDocs(res)
    }
    if (error) throw error
  }

  const sort = (arr: IDocument[]) => {
    const map = new Map()
    for (let i = 0; i < arr.length; i++) {
      const elem = arr[i]
      const id = elem.documentGroup.id
      if (!map.has(id)) {
        map.set(id, [elem])
      } else {
        map.get(id).push(elem)
      }
    }
    return Array.from(map.values())
  }

  const addNewGroup = (group: IDocumentGroup) => {
    setDocumentsGroups([...documentsGroups, group])
  }

  return (
      <Flex justify={"center"}>
        <Flex vertical className={classes.documentsPage}>
          <BackBtn/>

          <Flex justify={"space-between"}>

            <h1 className={classes.heading}>Документи
              громади{searchedDocs !== null && searchedDocs.length > 0 && ": пошук"}</h1>

            <Flex gap={3}>

              <Search allowClear

                      placeholder="Шукати..."
                      className={classes.input}
                      style={{width: 300, color: "black"}}
                      onSearch={onSearchDocument}
                      enterButton
                      loading={isSearching}
              />

              {checkPermission(jwt, "admin") &&
                  <AddNewGroupModal addGroup={addNewGroup}
                                    groupId={null}
                  />
              }

            </Flex>
          </Flex>
          <Divider/>
          {searchedDocs !== null
              ?
              <Flex vertical gap={10}>
                {searchedDocs.length === 0
                    ?
                    <Flex align={"center"} vertical gap={10}>
                      <span className={classes.res}>Результатів не знайдено.</span>
                      <Button style={{width: "fit-content"}} onClick={() => setSearchedDocs(null)}>Всі
                        документи</Button>
                    </Flex>
                    :
                    searchedDocs.map((docs, index) =>
                        <Flex className={classes.searchGroup} vertical key={"docs-" + index}
                              style={{padding: 5}}>
                                <span
                                    onClick={() => {
                                      if (docs[0].documentGroup !== null) {
                                        nav(`/documentGroup/${docs[0].documentGroup.documentGroup.id}/subGroup/${docs[0].documentGroup.id}`)
                                      }
                                    }}
                                    style={{marginLeft: 20}} className={classes.groupName}
                                >
                                    {docs[0].documentGroup.documentGroup !== null ?
                                        <span> {docs[0].documentGroup.documentGroup.name + ": "} {docs[0].documentGroup.name}</span>
                                        :
                                        <span>{docs[0].documentGroup.name}</span>
                                    }
                                </span>
                          <Flex gap={10} vertical>

                            {docs.map((doc) =>
                                <Document document={doc} onClick={() => {
                                }} key={"doc-" + doc.id}/>
                            )}
                          </Flex>
                        </Flex>
                    )
                }
              </Flex>
              :
              <Flex vertical gap={25}>
                {documentsGroups.map((group) =>
                    <Flex key={"group-" + group.id} gap={8} vertical className={classes.group}>
                      <h2 onClick={() => nav("/documentGroup/" + group.id)}
                          className={classes.groupName}>{group.name}</h2>
                      <Flex gap={20}>
                        {group.groups?.map((subGroup) =>
                            <Flex key={"subGroup-" + subGroup.id} className={classes.subGroup}>
                              <h3 onClick={() => nav(`/documentGroup/${group.id}/subGroup/${subGroup.id}`)}
                                  className={classes.subGroupName}>{subGroup.name}</h3>
                            </Flex>
                        )}
                      </Flex>
                    </Flex>
                )}
              </Flex>
          }
        </Flex>
      </Flex>
  );
};

export default AllDocumentsPage;