import React, {FC, useState} from 'react';
import {Accordion} from "react-bootstrap";
import {Dropdown, MenuProps, Typography} from "antd";
import {IDocumentGroup} from "../../API/services/InstitutionService";
import {DeleteOutlined, EditOutlined, PlusCircleOutlined} from "@ant-design/icons";

const { Paragraph } = Typography;

interface GroupsProps {
    onSelectAction : (action : string, groupId : number) => void
    fileNameFontSize : number
    editGroupId : number | undefined
    setNewName :  React.Dispatch<React.SetStateAction<string | undefined>>
    group : IDocumentGroup
}

const Groups: FC<GroupsProps> = ({
                                     editGroupId,
                                     setNewName,
                                     fileNameFontSize,
                                     onSelectAction,
                                     group,
                                 }) => {

    const [isEditing, setIsEditing] = useState(group.id === editGroupId)

    function getItems(id: number) {
        const items: MenuProps['items'] = [
            {
                icon : <PlusCircleOutlined  style={{ fontSize: 15}}/>,
                label: 'Додати документ',
                key: `addDoc-${id}`,
            },
            {
                icon: <EditOutlined style={{ fontSize: 15}} />,
                label: 'Змінити текст',
                key: `editName-${id}`,
            },
            {
                icon:<DeleteOutlined style={{ fontSize: 15}} />,
                label: 'Видалити',
                key: `delete-${id}`,
                danger : true
            }
        ];
        return items
    }

    const onAction = (key : string) => {
        const values = key.split("-")
        const action = values[0]
        const groupId = values[1]

        switch (action) {
            case "editName" :
                console.log("edit", groupId)
                setIsEditing(true)
                break;
            default : console.error("def")
        }
        onSelectAction(action, Number(groupId))
    }


    return (
        <Dropdown menu={{items: getItems(group.id), onClick: (e) => onAction(e.key)}}
                  trigger={['contextMenu']}
        >

            <Accordion.Header>
                <Paragraph style={{margin: 0, fontWeight: "initial", fontSize: fileNameFontSize + 2, width: "100%"}}
                           editable={{
                                editing : isEditing,
                                tooltip: 'click to edit text',
                                triggerType: ['text'],
                                onCancel : () => setIsEditing(false),
                                onChange : (str : string) => setNewName(str)
                            }}
                >{group.name}
                </Paragraph>
            </Accordion.Header>
        </Dropdown>
    );
};

export default Groups;