import React, {FC, useContext, useRef, useState} from 'react';
import type {FormProps, GetProp, UploadFile, UploadProps} from 'antd';
import {Button, Flex, Form, Image, Input, message, Modal, Upload} from 'antd';
import {AuthContext} from "../../../context/AuthContext";
import {checkImageTypeBeforeUpload, checkPermission, getBase64} from "../../../API/Util";
import {createLinkBanner, CreateLinkBannerRequest} from "../../../API/services/main/BannersService";
import {InboxOutlined} from "@ant-design/icons";
import Draggable from 'react-draggable';
import type { DraggableData, DraggableEvent } from 'react-draggable';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const onFinishFailed: FormProps<CreateLinkBannerRequest>['onFinishFailed'] = (errorInfo) => {
  message.error(
      <div>
        <strong>Вказане невірне значення!</strong>
        {errorInfo.errorFields.map((field) => (
            <p key={field.name.toString()}>
              {field.errors.map((error, index) => (
                  <span key={index} style={{display: "block"}}>{error}</span>
              ))}
            </p>
        ))}
      </div>
  );
};

interface AddBannerModalProps {
  onAdd: (banner: any) => void
}
const AddBannerModal: FC<AddBannerModalProps> = ({onAdd}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {Dragger} = Upload;
  const {jwt} = useContext(AuthContext)
  const [imageFile, setImageFile] = useState<any>(null)
  const [previewImage, setPreviewImage] = useState('');
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  const draggleRef = useRef<HTMLDivElement>(null!);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };


  const handlePreview = async (file: UploadFile) => {
    await getBase64(file.originFileObj as FileType, (res: string) => {
      setPreviewImage(res)
    });
  };

  const props: UploadProps = {
    beforeUpload: checkImageTypeBeforeUpload,
    name: 'file',
    multiple: false,
    showUploadList: false,
    onChange(info) {
      console.log("onChange", info.file)
      setImageFile(info.file.originFileObj)
      handlePreview(info.file)
    }
  };

  const onFinish: FormProps<CreateLinkBannerRequest>['onFinish'] = async (values) => {
    console.log('Success:', values);

    let data = new FormData();
    if (!values.image && imageFile == null) {
      message.warning("Вкажіть посилання на зоображення банера, або завантажте картинку", 10)
      return;
    }

    try {
      data.set("url", values.url)
      data.set("text", values.text)

      if (values.image) {
        data.set("imageUrl", values.image)
      }
      if (imageFile != null) {
        data.set("imageFile", imageFile)
      }
      if (jwt) {
        let res = await createLinkBanner(data, jwt)
        if (res.status === 201) {
          console.log(res.data)
          onAdd(res.data)
          message.success("Успішно додано!")
          form.resetFields()
          setImageFile(null)
          handleCancel()
        }
      }
    } catch (e) {
      console.log("Error when add banner", e)
      message.error("Помилка при додаванні банера")
    }
  };

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  return jwt && checkPermission(jwt, "admin") ? (
      <>
        <Button onClick={showModal}>Додати банер</Button>
        <Modal centered

               modalRender={(modal) => (
                   <Draggable
                       disabled={disabled}
                       bounds={bounds}
                       nodeRef={draggleRef}
                       onStart={(event, uiData) => onStart(event, uiData)}
                   >
                     <div ref={draggleRef}>{modal}</div>
                   </Draggable>
               )}
               title={
                 <div
                     style={{ width: '100%', cursor: 'move' }}
                     onMouseOver={() => {
                       if (disabled) {
                         setDisabled(false);
                       }
                     }}
                     onMouseOut={() => {
                       setDisabled(true);
                     }}
                     onFocus={() => {}}
                     onBlur={() => {}}
                 >
                   Додати банер
                 </div>
               }

               width={700}
               footer={null}
               open={isModalOpen}
               onOk={handleOk}
               onCancel={handleCancel}>
          <Form
              form={form}
              name="basic"
              labelCol={{span: 8}}
              wrapperCol={{span: 16}}
              style={{maxWidth: 600}}
              initialValues={{remember: true}}
              onFinishFailed={onFinishFailed}
              onFinish={onFinish}
              autoComplete="off"
          >
            <Form.Item<CreateLinkBannerRequest>
                label="Текст"
                name="text"
                rules={[{required: true, message: 'Буль ласка введіть текст!'}]}
            >
              <Input/>
            </Form.Item>

            <Form.Item<CreateLinkBannerRequest>
                label="Посилання"
                name="url"
                rules={[{required: true, message: 'Буль ласка введіть посилання!'}, {type: 'url'}]}
            >
              <Input/>
            </Form.Item>

            <Form.Item<CreateLinkBannerRequest>
                label="Посилання на зоображення"
                name="image"
                rules={[{required: false}, {type: 'url'}]}
            >
              <Input/>
            </Form.Item>

            <Form.Item label="Зоображення" valuePropName="fileList" getValueFromEvent={normFile}>

              <Flex gap={15} vertical>

              <Dragger {...props}
                       customRequest={() => {
                       }}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined/>
                </p>
                <p className="ant-upload-text">Натисніть або перетягніть файл в цю зону для завантаження</p>
                <p className="ant-upload-hint">
                Підтримується одноразове завантаження.
                </p>
              </Dragger>

                {previewImage &&
                    <Image style={{maxHeight: 300}} src={previewImage}/>
                }
              </Flex>
            </Form.Item>

            <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                Додати банер
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
  ) : null;
};

export default AddBannerModal;