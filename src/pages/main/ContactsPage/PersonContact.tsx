import React, {FC} from 'react';
import {Button, Dropdown, Flex, Image, MenuProps, message} from "antd";

interface PersonContactProps {
  photo : string,
  title : string,
  name : string,
  phoneNumber?: string
}

const handleCopy = async (text : string) => {
  try {
    await navigator.clipboard.writeText(text);
    message.info("Номер скопійовано!")
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

function createItems (phone : string) : MenuProps['items'] {
  return [
    {
      label: (
          <a href={"tel:" + phone}>
            📞 Поздвонити
          </a>
      ),
      key: phone + "1",
    },
    {
      label: (
          <Button onChange={() => handleCopy(phone)}>
            Копіювати
          </Button>
      ),
      key: phone + "2",
    },
  ];
}


const PersonContact: FC<PersonContactProps> = ({photo, title, phoneNumber, name}) => {
    return (
        <Flex style={{padding: 5}} align={"center"} vertical gap={10}>
         <span style={{maxWidth: 180, textAlign: "center"}}>{title}</span>
          <Image width={200} height={200} src={photo} style={{borderRadius: "50%", objectFit: "cover"}} preview={false}/>
          {phoneNumber &&
            <Dropdown menu={{ items: createItems(phoneNumber) }} trigger={['click']}>
            </Dropdown>
          }
          <span>{name}</span>
        </Flex>
    );
};

export default PersonContact;