import React, {useContext, useEffect, useRef, useState} from 'react';
import {App, Button, Checkbox, DatePicker, Divider, Dropdown, Flex, Input, MenuProps, Select, Tooltip} from "antd";
import classes from './AddNewsPage.module.css'
import {PlusOutlined} from "@ant-design/icons";
import locale from 'antd/es/date-picker/locale/uk_UA';
// @ts-ignore
import imagePlaceholder from "../../assets/image-placeholder.svg"
import {Editor} from "@tinymce/tinymce-react";
import {Editor as TinyMCEEditor} from 'tinymce';
import {RangePickerProps} from "antd/es/date-picker";
import dayjs from 'dayjs';
import BackBtn from "../../components/BackBtn/BackBtn";
// @ts-ignore
import {CSSTransition} from 'react-transition-group';
import {getBase64} from "../../API/Util";
import NewsImage from "./NewsImage/NewsImage";
import {deleteNewsTypeById, getNewsTypesList, NewsType, saveNews} from "../../API/services/NewsService";
import {AuthContext} from "../../context/AuthContext";
import NewsPreview from "./NewsPreview";
import {useActions} from "../../hooks/useActions";
import {INewsPreview} from "../../domain/NewsInt";
import AddNewsTypeModal from "./AddNewsTypeModal";

const AddNewsPage = () => {


    const inputFile = useRef<HTMLInputElement | null>(null)
    const editorRef = useRef<TinyMCEEditor | null>(null);
    const [title, setTitle] = useState<string>('')
    const [dateOfPublication, setDateOfPublication] = useState<string>('')
    const [dateOfPostponedPublication, setDateOfPostponedPublication] = useState<string>('')
    const [imagesFiles, setImagesFiles] = useState<string[]>([])
    const {jwt} = useContext(AuthContext)
    const {notification} = App.useApp();
    const [newsTypes, setNewsTypes] = useState<NewsType[]>([])
    const [newsTypeId, setNewsTypeId] = useState<number>()
    const [isNewType, setIsNewType] = useState<boolean>(false)
    const [isNewTypeModalOpen, setIsNewTypeModalOpen] = useState<boolean>(false);
    const {setNewsPreview} = useActions()
    const [text, setText] = useState<string>()

    const getTypes = async () => {
        if (jwt) {
            const {data, error} = await getNewsTypesList(jwt)
            if (data) setNewsTypes(data)

            if (error) throw error
        } console.log("not auth")
    }


    useEffect(() => {
        const iNewsPreview : INewsPreview = {description : title,
            main_text: text,
            views: 100,
            created: [dateOfPublication.split("T")[0]],
            previewImages: imagesFiles,
        }

        setNewsPreview(iNewsPreview)
    }, [text, title, dateOfPublication, imagesFiles]);

    const onSelectNewsType = (id: number | string) => {
        setIsNewTypeModalOpen(false)
        setNewsTypeId( Number(id))
    }


    function newsToSelectOptions(types : NewsType[])  {

        const options = types.map((type) => {

            const onDelete: MenuProps['onClick'] = async ({key}) => {
                let id = Number(key.split("-")[1])
                console.log(id)
                if (jwt) {
                    const {error} = await deleteNewsTypeById(id, jwt)
                    if (error) notification.error({message: "Не можу видалити тему ): 👿"})
                    else {
                        setNewsTypes(newsTypes.filter((n) => n.id !== id))
                        setNewsTypeId(-1)
                    }
                }
            }

            return {label :
                    <Dropdown placement={"topLeft"}  menu={{ items: [{label: "Видалити", key: "deleteNewsTypeOption-" + type.id, style: {zIndex: 2147483647}, danger: true}], onClick : onDelete}} trigger={['contextMenu']}>
                        <Tooltip placement={"rightTop"} title={type.titleExplanation}><span >{type.title}</span></Tooltip>
                    </Dropdown>
                     , value : type.id}
        })
        options.push({label: <span>Без теми</span>, value: -1})
        return options;
    }

    useEffect(() => {
        if (jwt) {
            getTypes()
        }
    }, [jwt]);

    const getEditorText  = () : string => {
        if (editorRef.current) {
            if (editorRef.current) {
                return  editorRef.current.getContent();
            }
        }
        return ""
    }

    const onImageAdd = () => {
        inputFile.current?.click()
    }

    const onImageLoad = (file: FileList | null) => {
        if (file !== null) {
            getBase64(file[0], (res: string) => {
                setImagesFiles([...imagesFiles, res])
            })
        }
    }

    const onDateOfPublicationChange = (e : dayjs.Dayjs | null) => {
        if (e) {
            setDateOfPublication(e.toISOString())
        }
    }

    const onDateOfPostponedPublicationChange = (e : dayjs.Dayjs | null) => {
        if (e) {
            setDateOfPostponedPublication(e.toISOString())
        }
    }

    const onSave = () => {
        let data = new FormData()
        data.append("title", title)

        data.append("text", getEditorText())
        data.append("dateOfPublication", dateOfPublication)
        data.append("dateOfPostponedPublication", dateOfPostponedPublication)

        console.log(newsTypeId)
        if (newsTypeId !== undefined) {
            data.append("newsType", newsTypeId.toString())
        } else {
            data.append("newsType", "-1")
        }


        for (let i = 0; i < imagesFiles.length; i++) {
            data.append("images", imagesFiles[i])

        }
        save(data)
    }


    const save = async (formData : FormData) => {
        if (jwt) {
            const {data, error} = await saveNews(formData, jwt)

            if (data) {
                notification.success({message: "ok"})
            }
            if (error) {
                notification.error({message: "error"})
            }
        } else   notification.warning({message: "not auth"})
    }

    const nodeRef = useRef(null);

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return current && current < dayjs().endOf('day');
    };

    const [isPostponedPublication, setIsPostponedPublication] = useState<boolean>(false)

    const onisPostponedPublicationChange = (val : boolean) => {
        console.log(val)
        setIsPostponedPublication(val)
    }
    
    return (
        <Flex justify={"center"}>
            <Flex vertical gap={20} className={classes.AddNewsPage}>
                <BackBtn/>
                <Flex wrap={"wrap"} justify={"space-between"}>
                    <Flex style={{flexGrow: 1}} justify={"center"}>
                        <h1>Нова новина</h1>
                    </Flex>
                    <Flex wrap={"wrap"} gap={15}>
                        <NewsPreview/>
                        <Button onClick={onSave} type={"primary"}>Зберегти</Button>
                    </Flex>
                </Flex>

                <div style={{maxWidth: 500}} className={classes.primaryBg}>
                    <span className={classes.inputTitle}>Заголовок</span>
                    <Input onChange={(e) => setTitle(e.target.value)} value={title} type="text"/>
                </div>

                <Flex wrap={"wrap"} gap={20} >
                    <input multiple onChange={(e) => onImageLoad(e.target.files)} style={{display: "none"}} ref={inputFile} type="file"/>
                    <Flex wrap={"wrap"} className={[classes.imagesWrapper, classes.primaryBg].join(' ')} gap={15}>
                        <Flex align={"center"} gap={5} wrap={"wrap"} justify={"center"} style={{flexGrow:1}}>
                            {imagesFiles.length > 0 ?
                                imagesFiles.map((img) =>
                                    <NewsImage key={"image-" + img.length}  imagesFile={imagesFiles} setImagesFiles={setImagesFiles} img={img}/>
                                )
                                :
                                <img className={classes.imagePlaceholder} src={imagePlaceholder} alt="imagePlaceholder"  />
                            }
                        </Flex>

                        <Flex vertical gap={5}>
                            <span className={classes.inputTitle}>Фото</span>
                            <Button icon={ <PlusOutlined />} onClick={onImageAdd} >
                                Додати
                            </Button>
                        </Flex>
                    </Flex>

                    <Flex gap={20} wrap={"wrap"}>
                        <Flex gap={10} vertical style={{height: "fit-content"}} className={classes.primaryBg}>
                            <span className={classes.inputTitle}>Дата публікації</span>
                            <DatePicker onChange={onDateOfPublicationChange} style={{width: "fit-content"}} locale={locale}/>
                            <Checkbox onChange={(e) => onisPostponedPublicationChange(e.target.checked)} >Відкласти публікацію</Checkbox >

                            <CSSTransition nodeRef={nodeRef} in={isPostponedPublication} timeout={200} classNames="smoothAppearance">
                                <Flex  ref={nodeRef} className={classes.test} vertical style={{display : isPostponedPublication ? "flex" : "none"}}>
                                    <span className={classes.inputTitle}>Дата та час коли новина опублікується</span>
                                    <DatePicker onChange={onDateOfPostponedPublicationChange} disabledDate={disabledDate} showTime={{ format: 'HH:mm' }} locale={locale}/>
                                </Flex>
                            </CSSTransition>
                        </Flex>

                        <Flex wrap={"wrap"} vertical gap={15} className={classes.primaryBg} style={{width: "fit-content", height: "fit-content"}}>
                            <span className={classes.inputTitle}>Тема новини</span>
                            <Flex wrap={"wrap"} gap={15}>
                                <Select style={{minWidth: 170}}
                                    onSelect={onSelectNewsType}
                                    value={newsTypeId}
                                    defaultValue={-1}
                                    loading={newsTypes.length === 0}
                                    options={newsToSelectOptions(newsTypes)}

                                        dropdownRender={(menu) => (
                                            <>
                                                {menu}
                                                <Divider style={{ margin: '8px 0' }} />
                                                <Button type="text" icon={<PlusOutlined />} onClick={() => setIsNewTypeModalOpen(true)}>
                                                    Нова тема
                                                </Button>
                                            </>
                                        )}
                                />
                                <AddNewsTypeModal
                                    setNewsTypeId={setNewsTypeId}
                                    isModalOpen={isNewTypeModalOpen}
                                    setIsModalOpen={setIsNewTypeModalOpen}
                                    newsTypes={newsTypes}
                                    setNewsTypes={setNewsTypes}
                                    isNewType={isNewType}
                                />

                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>


                <Flex vertical className={classes.inputWrapper} >
                    <span className={classes.inputTitle} style={{margin: 10}}>Основний текст</span>
                    <Editor
                        onInit={(evt, editor) => {
                            editorRef.current = editor
                        }}
                        onChange={() => {setText(getEditorText)}}
                        apiKey={"s9e7vn9jkcnp5d5ptky7olb6es0niy1s9rtf7lz0d2l5tlwi"}
                        init={{
                            height: 500,
                            menubar: false,
                            plugins: [
                                'advlist autolink lists link image charmap print preview anchor',
                                'searchreplace visualblocks code fullscreen',
                                'insertdatetime media table paste code help wordcount'
                            ],
                            toolbar: 'undo redo | formatselect | ' +
                                'bold italic backcolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                        }}
                    />
                </Flex>

                <Flex>
                    <Button onClick={onSave} type={"primary"}>Зберегти</Button>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default AddNewsPage;