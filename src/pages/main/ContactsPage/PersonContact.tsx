import React, {FC} from 'react';
import {Button, Dropdown, Flex, Image, MenuProps, message} from "antd";

interface PersonContactProps {
  photo : string,
  title : string,
  name : string,
  email? : string,
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

function createItemsForPhone (phone : string) : MenuProps['items'] {
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
          <Button onClick={() => handleCopy(phone)}>
            Копіювати
          </Button>
      ),
      key: phone + "2",
    },
  ];
}
function createItemsForEmail(email : string) : MenuProps['items'] {
  return [
    {
      label: (
          <Button onClick={() => handleCopy(email)}>
            Копіювати
          </Button>
      ),
      key: email + "2",
    },
  ];
}


const PersonContact: FC<PersonContactProps> = ({photo, title, phoneNumber, name, email}) => {
    return (
        <Flex style={{padding: 5}} align={"center"} vertical gap={5}>
         <span style={{maxWidth: 200, textAlign: "center"}}>{title}</span>
          <Image width={200} height={200} src={photo} style={{borderRadius: "50%", objectFit: "cover"}} preview={false}/>
          <Flex vertical align={"center"} gap={5}>
            {phoneNumber &&
                <Dropdown menu={{ items: createItemsForPhone(phoneNumber) }} trigger={['click', "hover"]}>
                  {phoneNumber}
                </Dropdown>
            }

            {email &&
                <Dropdown menu={{ items: createItemsForEmail(email) }} trigger={['click']}>
                  {email}
                </Dropdown>
            }
          </Flex>


          <span style={{fontWeight: "bold"}}>{name}</span>
        </Flex>
    );
};

export default PersonContact;