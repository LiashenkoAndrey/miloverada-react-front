import React, {FC, useContext, useState} from 'react';
import ApplicationPageTemplate
    from "../../../components/main/ApplicationPageTemplate/ApplicationPageTemplate";
import type {FormProps } from 'antd';
import {Button, Flex, Form, GetProp, Image, Input, Upload, UploadFile, UploadProps} from 'antd';
import {checkImageTypeBeforeUpload, getBase64} from "../../../API/Util";
import {RcFile} from "antd/es/upload/interface";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import classes from "./ApplicationCreationPage.module.css"
import {createApplication} from "../../../API/services/main/ApplicationService";
import {AuthContext} from "../../../context/AuthContext";


type UploadFileEx = UploadFile & {
  image : FileType
  preview : string
}

const { TextArea } = Input;

type FieldType = {
    username: string;
    phone: string;
    applicationText : string
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];



const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};
interface ApplicationCreationPageProps {
}


const ApplicationCreationPage: FC<ApplicationCreationPageProps> = (props) => {
  const [fileList, setFileList] = useState<UploadFileEx[]>([])
  const [previewImage, setPreviewImage] = useState('');
  const {jwt} = useContext(AuthContext)

  const onUploadChange = async (file : FileType) => {
    if (file === undefined) return;
    console.log("onUploadChange", file)
    getBase64(file, (imageBase64String: string) => {
      console.log("image", imageBase64String)
        setFileList([...fileList, {image : file, preview: imageBase64String, name : "random", url: imageBase64String, uid : imageBase64String.length.toString()}])
    });
  }

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
    let data = new FormData()
    data.append("fullName", values.username)
    data.append("phone", values.phone)
    data.append("applicationText", values.applicationText)

    for (const element of fileList) {
      data.append("files", element.image);
    }
    createApplication(data)

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
        <Form
            name="basic"
            labelCol={{span: 5}}
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
                    rules={[{ required: true, message: 'Будь ласка введіть ваше ПІБ!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Номер телефону"
                    name="phone"
                    rules={[{ required: true, message: 'Будь ласка введіть ваш номер телефону!' }]}
                >
                    <Input addonBefore={"+380"} />
                </Form.Item>

                <Form.Item label="Звернення"  wrapperCol={{ span: 24 }}>
                    <TextArea  maxLength={2000} style={{borderRadius: 10, width: "100%" }} showCount rows={4} />
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Підтвердити
                    </Button>
                </Form.Item>
            </Form>
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
                    onUploadChange(info.file.originFileObj!)
                }}
                beforeUpload={checkImageTypeBeforeUpload}
                customRequest={() => {}}

            >
              <button style={{ border: 0, background: 'none' }} type="button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </button>
            </Upload>

        {previewImage && (
            <Image
                wrapperStyle={{ display: 'none' }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(''),
                }}
                src={previewImage}
            />
        )}

        </ApplicationPageTemplate>
    );
};

export default ApplicationCreationPage;