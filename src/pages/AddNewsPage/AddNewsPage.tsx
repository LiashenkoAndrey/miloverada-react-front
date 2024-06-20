import React, {useContext, useEffect, useRef, useState} from 'react';
import {App, Button, Checkbox, DatePicker, Divider, Dropdown, Flex, Input, MenuProps, Select, Tooltip} from "antd";
import classes from './AddNewsPage.module.css'
import {PlusOutlined} from "@ant-design/icons";
import locale from 'antd/es/date-picker/locale/uk_UA';
// @ts-ignore
import imagePlaceholder from "../../assets/image-placeholder.svg"
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
import AddNewsTypeModal from "./AddNewsTypeModal";
import HtmlEditor from "../../components/HtmlEditor";
import {INews, INewsImage} from "../../domain/NewsInt";
import {useNavigate} from "react-router-dom";

const AddNewsPage = () => {


    const inputFile = useRef<HTMLInputElement | null>(null)
    const editorRef = useRef<TinyMCEEditor | null>(null);
    const [title, setTitle] = useState<string>('')
    const [dateOfPublication, setDateOfPublication] = useState<string>('')
    const [dateOfPostponedPublication, setDateOfPostponedPublication] = useState<string>('')
    const [imagesFiles, setImagesFiles] = useState<File[]>([])
    const [newsImages, setNewsImages] = useState<INewsImage[]>([])
    const {jwt} = useContext(AuthContext)
    const {notification} = App.useApp();
    const [newsTypes, setNewsTypes] = useState<NewsType[]>([])
    const [newsTypeId, setNewsTypeId] = useState<number>()
    const [isNewType, setIsNewType] = useState<boolean>(false)
    const [isNewTypeModalOpen, setIsNewTypeModalOpen] = useState<boolean>(false);
    const {setNewsPreview} = useActions()
    const [text, setText] = useState<string>()
    const nav = useNavigate()
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const getTypes = async () => {
        if (jwt) {
            const {data, error} = await getNewsTypesList(jwt)
            if (data) setNewsTypes(data)

            if (error) throw error
        } else console.log("not auth")
    }


    useEffect(() => {
        const iNewsPreview : INews = {description : title,
            main_text: text,
            commentsAmount : 1,
            views: 100,
            dateOfPublication: dateOfPublication.split("T")[0],
            images: newsImages,
        }
        setNewsPreview(iNewsPreview)
    }, [text, title, dateOfPublication, imagesFiles, newsImages]);

    const onSelectNewsType = (id: number | string) => {
        setIsNewTypeModalOpen(false)
        setNewsTypeId( Number(id))
    }


    function newsToSelectOptions(types : NewsType[])  {

        const options = types.map((type) => {

            const onDelete: MenuProps['onClick'] = async ({key}) => {
                let id = Number(key.split("-")[1])
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


    const onImageLoad = (fileList: FileList | null) => {
        if (fileList !== null) {
            const  arr : INewsImage[] = []
            for (let i = 0; i < fileList.length; i++) {
                setImagesFiles([...imagesFiles, fileList[i]])

                getBase64(fileList[i], (res: string, filename : string) => {
                    const img : INewsImage = {
                        mongoImageId : res,
                        fileName : filename
                    }
                    arr.push(img)
                    if (i === fileList.length-1) {
                        setNewsImages([...newsImages, ...arr])
                    }
                })
            }
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

        if (newsTypeId !== undefined) {
            data.append("newsTypeId", newsTypeId.toString())
        } else {
            data.append("newsTypeId", "-1")
        }
        for (let i = 0; i < imagesFiles.length; i++) {
            data.append("images", imagesFiles[i])
        }
        save(data)
    }


    const save = async (formData : FormData) => {
        if (jwt) {
            setIsLoading(true)
            const {data, error} = await saveNews(formData, jwt)
            setIsLoading(false)

            if (data) {
                notification.success({message: "Успішно збережено"})
                setTimeout(() => {
                    nav("/newsFeed/all")
                }, 500)
            }
            if (error) {
                notification.error({message: "Виникла помилка"})
            }
        } else   notification.warning({message: "Не авторизовано"})
    }

    const nodeRef = useRef(null);

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return current && current < dayjs().endOf('day');
    };

    const [isPostponedPublication, setIsPostponedPublication] = useState<boolean>(false)

    const onPostponedPublicationChange = (val : boolean) => {
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
                        <Button onClick={onSave}
                                type={"primary"}
                                loading={isLoading}
                        >
                            Зберегти
                        </Button>
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
                                newsImages.map((img) =>
                                    <NewsImage key={"image-" + img.fileName}  imagesFile={newsImages} setImagesFiles={setNewsImages} img={img}/>
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
                            <Checkbox onChange={(e) => onPostponedPublicationChange(e.target.checked)} >Відкласти публікацію</Checkbox >

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
                    <HtmlEditor val={text} onInit={(evt, editor) => {
                        editorRef.current = editor
                    }}
                        onChange={(str) => {setText(str)}}
                    />
                </Flex>

                <Flex>
                    <Button onClick={onSave}
                            loading={isLoading}
                            type={"primary"}
                    >
                        Зберегти
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default AddNewsPage;