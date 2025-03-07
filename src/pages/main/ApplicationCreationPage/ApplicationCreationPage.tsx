import React, {FC, useState} from 'react';
import ApplicationPageTemplate
  from "../../../components/main/ApplicationPageTemplate/ApplicationPageTemplate";
import type {FormProps} from 'antd';
import {
  Button,
  Flex,
  Form,
  GetProp,
  Image,
  Input,
  message, Result,
  Upload,
  UploadFile,
  UploadProps
} from 'antd';
import {generateClientTempId, getBase64} from "../../../API/Util";
import {PlusOutlined} from "@ant-design/icons";
import {createApplication} from "../../../API/services/main/ApplicationService";
import {useSubscription} from "react-stomp-hooks";
import {IMessage} from "@stomp/stompjs/src/i-message";
import {DeleteMessageDto} from "../../../API/services/forum/ForumInterfaces";
import {PuffLoader} from "react-spinners";
import {useNavigate} from "react-router-dom";


type UploadFileEx = UploadFile & {
  image: FileType
  preview: string
}

const {TextArea} = Input;

type FieldType = {
  username: string;
  phone: string;
  email?: string;
  applicationText: string
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];


const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

interface ApplicationCreationPageProps {
}

const FILE_PLACEHOLDER_ICON = "data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,"

const ApplicationCreationPage: FC<ApplicationCreationPageProps> = (props) => {
  const [fileList, setFileList] = useState<UploadFileEx[]>([])
  const [previewImage, setPreviewImage] = useState('');
  const [form] = Form.useForm();
  const [tempNotificationDestination, setTempNotificationDestination] = useState<string>(generateClientTempId())
  const [isWaiting, setIsWaiting] = useState<boolean>(false)
  const [isSuccessSend, setIsSuccessSend] = useState<boolean>(false)
  const nav = useNavigate()

  const onApplicationSent = (response : IMessage) => {
    console.log("onApplicationSent",response)
    // message.success("Успішно відправлено!")
    form.resetFields()
    setFileList([])
    setIsSuccessSend(true)
  }

  useSubscription(`/topic/application-sent/${tempNotificationDestination}`, onApplicationSent)

  const onUploadChange = async (file: FileType, name : string) => {
    if (file === undefined) return;
    console.log("onUploadChange", file, file.type)
    if (file.type.startsWith("image/")) {

      getBase64(file, (imageBase64String: string) => {
        console.log("image", imageBase64String)
        setFileList([...fileList, {
          image: file,
          preview: imageBase64String,
          name: name,
          url: imageBase64String,
          uid: imageBase64String.length.toString()
        }])
      });
    } else {
      console.log()
      setFileList([...fileList, {
        image: file,
        preview: "imageBase64String",
        name: name,
        url: FILE_PLACEHOLDER_ICON,
        uid: name.length.toString()
      }])
    }
  }

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);

    let data = new FormData()
    data.append("fullName", values.username)
    data.append("phoneNumber", values.phone)
    data.append("applicationText", values.applicationText)
    data.append("tempNotificationDestination", tempNotificationDestination)
    if (values.email) {
      data.append("email", values.email)
    }
    for (const element of fileList) {
      data.append("files", element.image);
    }
    setIsWaiting(true)
    const {error} = await createApplication(data)

    if (error) {
      console.error(error.message)
      message.error("Виникла помилка, перевірте поля, та спробуйте ще раз.")
      setIsWaiting(false)
    } else {
      console.log("Received")
    }
  };

  const getBase642 = (file: FileType): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase642(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };


  const [previewOpen, setPreviewOpen] = useState(false);
  return (
      <ApplicationPageTemplate style={{width: 800}}>
        <h2 style={{textAlign: "center"}}>Оформлення звернення</h2>

        {isWaiting ? <Flex vertical align={"center"}>

              <Flex justify={"center"} style={{minHeight: 500}} align={"center"}>

                {isSuccessSend ?
                    <Result
                        status="success"
                        title="Ваше звернення успішно доставлено"
                        subTitle={"Очікуйте на відповідь за вказаним вами каналом зв'язку"}
                    />
                    :
                    <Flex align={"center"} vertical gap={10}>
                      <PuffLoader color={"#71092c"}/>
                      <span>Триває відправка...</span>
                    </Flex>
                }
              </Flex>

              <Button style={{width: 150}} onClick={() => nav('/')}>На головну сторінку</Button>
            </Flex> :
            <>
              <Form
                  form={form}
                  name="basic"
                  labelCol={{span: 6}}
                  wrapperCol={{span: 16}}
                  style={{maxWidth: 800}}
              initialValues={{remember: true}}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
          >
            <Form.Item<FieldType>
                label="ПІБ"
                name="username"
                rules={[{required: true, message: 'Будь ласка введіть ваше ПІБ!'}]}
            >
              <Input/>
            </Form.Item>

            <Form.Item<FieldType>
                label="Номер телефону"
                name="phone"
                rules={[{required: true, message: 'Будь ласка введіть ваш номер телефону!'}]}
            >
              <Input addonBefore={"+380"}/>
            </Form.Item>

            <Form.Item<FieldType>
                label="Пошта (не обов'язково)"
                name="email"
                rules={[{ required: false, message: 'Будь ласка введіть правильну пошту!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Звернення"
                       name={"applicationText"}
                       wrapperCol={{span: 24}}
                       rules={[{ required: true, message: 'Будь ласка введіть звернення!'}]}
            >
              <TextArea maxLength={3000} style={{borderRadius: 10, width: "100%", maxHeight: 350}} showCount
                        rows={10}/>
            </Form.Item>

            <Flex style={{padding: 20}}>

              <Upload
                  listType="picture-card"
                  onPreview={handlePreview}

                  fileList={fileList}
                  multiple
                  onChange={(info) => {
                    if (info.file.status == "removed") {
                      console.log("REMOVED!!!")
                      setFileList(fileList.filter((e) => e.uid !== info.file.uid))
                    }
                    console.log("onChange", info.file)
                    onUploadChange(info.file.originFileObj!, info.file.name)
                  }}
                  customRequest={() => {
                  }}

              >
                <button style={{border: 0, background: 'none'}} type="button">
                  <PlusOutlined/>
                  <div style={{marginTop: 8}}>Прикріпити файл</div>
                </button>
              </Upload>
            </Flex>

            <Flex justify={"center"}>
              <Button style={{alignSelf: "center"}} type="primary" htmlType="submit">
                Підтвердити
              </Button>
            </Flex>
          </Form>

          {previewImage && (
              <Image
                  wrapperStyle={{display: 'none'}}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                  }}
                  src={previewImage}
              />
          )}
        </>
        }

      </ApplicationPageTemplate>
  );
};

export default ApplicationCreationPage;