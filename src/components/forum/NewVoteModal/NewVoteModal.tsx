import React, {FC, useState} from 'react';
import {Button, Checkbox, Flex, Input, List, Modal, notification, Space} from "antd";
import {NewVoteDto, IVote} from "../../../API/services/forum/VoteService";
import useInput from "../../../API/hooks/useInput";
import {useAuth0} from "@auth0/auth0-react";
import {BorderOutlined, CloseOutlined, DeleteOutlined, HolderOutlined} from "@ant-design/icons";
import classes from './NewVoteModal.module.css'


interface NewVoteModalProps {
    isOpen : boolean
    setIsOpen : React.Dispatch<React.SetStateAction<boolean>>
    onConfirm : (vote : NewVoteDto) => void
    isLoading? : boolean
}

const NewVoteModal : FC<NewVoteModalProps> = ({isOpen, isLoading, onConfirm, setIsOpen}) => {

    const [options, setOptions] = useState<string[]>([])
    const text = useInput('');
    const voteText = useInput('')
    const {user} = useAuth0()

    const onAddOption = () => {
        if (!text.value) return;
        if (options.includes(text.value)) {
            notification.warning({message : "Такий варіант вже існує"})
            return;
        }
        setOptions([...options, text.value])
        text.clear()
    }
    const onOk = ( ) => {
        if (!voteText.value) return;
        if (!user?.sub) return;
        if (options.length < 2) {
            notification.warning({message : 'Додайте хоча б два варіанти'})
            return;
        }

        let vote : NewVoteDto = {
            text : voteText.value,
            authorId : encodeURIComponent(user.sub),
            options : options
        }
        onConfirm(vote)
    }

    const [dragedOption, setDragedOption] = useState<string>('')
    const [lastDragOverOption, setLastDragOverOption] = useState<string>('')

    const onDragStart = (e :  React.DragEvent<HTMLDivElement> | undefined, option : string) => {
        console.log("drag start",e, option)
        setDragedOption(option)
    }

    const onDragEnd = (e :  React.DragEvent<HTMLDivElement> | undefined, option : string) => {
        console.log("end", e)
        if (e) {

            if (!e.target) return;
            const overIndex = options.indexOf(lastDragOverOption);

            const draggedItemIndex = options.indexOf(dragedOption);
            //

            if (overIndex !== -1 && draggedItemIndex !== -1) {
                options.splice(overIndex, 1);
                options.splice(draggedItemIndex, 0, lastDragOverOption);
                setDragedOption('')
            } else {
                console.log("else")
            }
        }
    }

    const onDeleteOption = (option : string) => {
        setOptions(options.filter((e) => e !== option))
    }

    const onDragOver = (e :  React.DragEvent<HTMLDivElement> | undefined, option : string) => {
        console.log('drag over', option)
        e?.preventDefault()
        setLastDragOverOption(option)
    }
     return (
        <Modal title={"Нове опитування"}
               open={isOpen}
               onOk={onOk}
               okButtonProps={{loading : isLoading}}
               onCancel={() => setIsOpen(false)}
        >

            <Flex vertical>
                <Input style={{marginBottom: 10}} placeholder={"Текст"} {...voteText}/>

                <Flex vertical style={{margin : "10px 5px"}}>
                    <List dataSource={options}


                        renderItem={(option) =>
                            <List.Item id={"draggableOption-" + option} style={{padding: "5px 5px"}}
                                className={[dragedOption === option ? classes.draggedOption : '', classes.option].join(' ')}
                                draggable="true"
                                onDragStart={(e) => onDragStart(e, option)}
                                onDragEnd={(e) => onDragEnd(e, option)}
                                onDragOver={(e) => onDragOver(e, option)}
                                onDrop={(e) => console.log('drop', e, option)}
                                actions={[<Button danger onClick={() => onDeleteOption(option)} icon={<CloseOutlined/>}></Button>]}
                            >
                                <List.Item.Meta avatar={<HolderOutlined />}
                                    title={option}
                                >
                                </List.Item.Meta>
                                {/*<span style={{ fontSize: 20}}>{option}</span>*/}
                            </List.Item>
                    }
                    />
                    {/*{options.map((option) =>*/}
                    {/*    <Flex>*/}
                    {/*        <span style={{ fontSize: 20}}>{option}</span>*/}
                    {/*    </Flex>*/}
                    {/*)}*/}
                </Flex>
                <Flex>
                    <Space.Compact style={{ width: '100%' }}>
                        <Button onClick={onAddOption} type="primary">Додати</Button>
                        <Input placeholder="Варіант"
                               value={text.value}
                               onChange={text.onChange}
                        />
                    </Space.Compact>

                </Flex>
                <Checkbox style={{marginTop : 10}}>Можна додати свій варіант</Checkbox>
            </Flex>

        </Modal>
    );
};

export default NewVoteModal;
