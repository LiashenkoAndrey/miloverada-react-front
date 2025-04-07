import React, {ChangeEvent, ChangeEventHandler, useContext, useEffect, useState} from 'react';
import {Button, Divider, Flex} from 'antd';
import {
  getAllDocumentsGroups, IDocument,
  IDocumentGroup,
  searchDocuments
} from "../../../API/services/main/DocumentService";
import classes from './AllDocumentsPage.module.css'
import BackBtn from "../../../components/main/BackBtn/BackBtn";
import Search from "antd/es/input/Search";
import {useNavigate, useSearchParams} from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [val, setVal] = useState<string>('')

  useEffect(() => {
    const query = searchParams.get('search')
    if (query) {
      setVal(query)
      doSearch( query)
    } else {
      console.log("else")
    }
  }, [searchParams]);

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


  const onSearchDocument: SearchProps['onSearch'] = async (query) => {
    if (query === '') {
      setSearchedDocs(null)
      return
    }
    setIsSearching(true)
    setSearchParams({search: query})
    doSearch(query)
  }

  const doSearch = async (query : string) => {
    const {data, error} = await searchDocuments(query)
    if (data) {
      setIsSearching(false)
      const res = sort(data)
      console.log(res)
      setSearchedDocs(res)
    }
    if (error) throw error
  }

  const sort = (arr: IDocument[]) => {
    const map = new Map()
    for (let i = 0; i < arr.length; i++) {
      const elem = arr[i]
      const id = elem.documentGroup && elem.documentGroup.id
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

  const onDocGroupNameClick = (docs : IDocument[]) => {
    if (docs[0].documentGroup !== null) {
      if (docs[0].documentGroup.documentGroup != null) {
        nav(`/documentGroup/${docs[0].documentGroup.documentGroup.id}/subGroup/${docs[0].documentGroup.id}`)
      } else {
        nav(`/documentGroup/${docs[0].documentGroup.id}`)
      }
    }
  }

  const onChan = (e : ChangeEvent<HTMLInputElement>) => {
    setVal(e.target.value)

  }

  const onDel = () => {
    searchParams.delete('search');
    setSearchParams(searchParams);
  }

  const showAllDocs = () => {
    onDel()
    setVal('')
    setSearchedDocs(null)
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
                      value={val}
                      onChange={onChan}
                      placeholder="Шукати..."
                      className={classes.input}
                      style={{width: 300, color: "black"}}
                      onSearch={onSearchDocument}
                      enterButton
                      onClear={onDel}
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
                      <Button style={{width: "fit-content"}} onClick={showAllDocs}>Всі
                        документи</Button>
                    </Flex>
                    :
                    searchedDocs.map((docs, index) =>
                        <Flex className={classes.searchGroup} vertical key={"docs-" + index}
                              style={{padding: 5}}>
                                <span
                                    onClick={() => onDocGroupNameClick(docs)}
                                    style={{marginLeft: 20}} className={classes.groupName}
                                >
                                    {docs[0].documentGroup && docs[0].documentGroup.documentGroup !== null ?
                                        <span> {docs[0].documentGroup.documentGroup.name + ": "} {docs[0].documentGroup.name}</span>
                                        :
                                        <span>{docs[0].documentGroup?.name}</span>
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
              <div className={classes.docsGrid} >
                {documentsGroups.map((group) =>
                    <Flex style={{order: group.order}} key={"group-" + group.id} gap={8}  vertical className={classes.group}>
                      <h2 onClick={() => nav("/documentGroup/" + group.id)}
                          className={classes.groupName}>{group.name}</h2>
                      <div className={classes.subGroupGrid} >
                        {group.groups?.map((subGroup) =>
                            <Flex key={"subGroup-" + subGroup.id} className={classes.subGroup}>
                              <h3 onClick={() => nav(`/documentGroup/${group.id}/subGroup/${subGroup.id}`)}
                                  className={classes.subGroupName}>{subGroup.name}</h3>
                            </Flex>
                        )}
                      </div>
                    </Flex>
                )}
              </div>
          }
        </Flex>
      </Flex>
  );
};

export default AllDocumentsPage;