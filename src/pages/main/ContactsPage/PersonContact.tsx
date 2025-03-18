import React, {FC} from 'react';
import {Button, Dropdown, Flex, Image, MenuProps, message} from "antd";
import classes from './PersonContact.module.css'

interface PersonContactProps {
  photo : string,
  title : string,
  name : string,
  email? : string,
  phoneNumber?: string
}

const handleCopy = async (text : string, messageForUser : string) => {
  try {
    await navigator.clipboard.writeText(text);
    message.info(messageForUser);
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
          <Button onClick={() => handleCopy(phone, "Номер скопійовано")}>
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
          <Button onClick={() => handleCopy(email, "Пошту скопійовано")}>
            Копіювати
          </Button>
      ),
      key: email + "2",
    },
  ];
}


const PersonContact: FC<PersonContactProps> = ({photo, title, phoneNumber, name, email}) => {
    return (
        <Flex className={classes.wrapper} justify={"center"} style={{padding: 5}} align={"center"} vertical>
         <span className={classes.jobTitle} style={{textAlign: "center"}}>{title}</span>
          <Image className={classes.personImage}  src={photo} style={{borderRadius: "50%", objectFit: "cover"}} preview={false}/>
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


          <span style={{fontWeight: "bold", textAlign: "center"}}>{name}</span>
        </Flex>
    );
};

export default PersonContact;