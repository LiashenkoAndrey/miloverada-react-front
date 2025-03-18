import React from 'react';
import {Flex} from "antd";
import contactPageClasses from './ContactsPage.module.css'
import PersonContact from "./PersonContact";


// @ts-ignore
import person1 from '../../../assets/personsPhoto/Логвиненко_Олена_Миколаївна.jpg'
// @ts-ignore
import person2 from '../../../assets/personsPhoto/olena.jpg'
// @ts-ignore
import person3 from '../../../assets/personsPhoto/lud.jpg'
// @ts-ignore
import person4 from '../../../assets/personsPhoto/tetiana.jpg'
// @ts-ignore
import person5 from '../../../assets/personsPhoto/svitlana.jpg'
// @ts-ignore
import person6 from '../../../assets/personsPhoto/sergii.jpg'
// @ts-ignore
import person7 from '../../../assets/personsPhoto/alex.jpg'
// @ts-ignore
import person8 from '../../../assets/personsPhoto/vitalii.jpg'
// @ts-ignore
import person9 from '../../../assets/personsPhoto/mariana.jpg'
// @ts-ignore
import person10 from '../../../assets/personsPhoto/fin.jpg'
// @ts-ignore
import person11 from '../../../assets/personsPhoto/lubov.png'
// @ts-ignore
import person12 from '../../../assets/personsPhoto/log.jpg'


const ContactsPage = () => {

  return (
      <Flex vertical align={"center"} justify={"center"} className={contactPageClasses.wrapper}>
        <h1 style={{marginTop: 70}}>Контакти</h1>
        <Flex justify={"center"} wrap={"wrap"} style={{marginTop: 20, maxWidth: 1200}} gap={20}>

          <PersonContact photo={person11} title={`Начальник сільської військової адміністрації`}
                         name="Любов Мінько"
                         phoneNumber={"0660768610"}
                         email={"miloveadmin@ukr.net"}/>

          <PersonContact photo={person3} title={`Cтароста Качкарівського старостату`}
                         name="Копил Людмила Анатоліївна"
                         phoneNumber={"+380671436890"}
                         email={"kach-miloverada@ukr.net"} />

          <PersonContact photo={person1} title={`Староста Новокам'янського старостинського округу`}
                         name="Ревко Діана Олександрівна"
                         phoneNumber={"0994909942"}
                         email={"novkam-miloverada@ukr.net"} />

          <PersonContact photo={person6}
                         title={`Cтароста Дудчанського старостату`}
                         name="Сергій Горюшкін"
                         email={"dud-miloverada@ukr.net"}
                         phoneNumber={"0978251919"}/>

          <PersonContact photo={person12}
                         title={`Староста Новокаїрського старостинського округу`}
                         name="Олена Логвиненко"
                         phoneNumber={"0994909942"}
                         email={"nk-miloverada@ukr.net"}/>

          <PersonContact photo={person7} title={`Відділ державної реєстрації речових майнових прав`}
                         name="Олександр Розковерко"
                         phoneNumber={"+380957777123"}
                         email={"rs.berislav@ukr.net"}/>

          <PersonContact photo={person8}
                         title={`Начальник відділу земельних відносин, комунальної власності, містобудування та архітектури`}
                         name="Віталій Горват"
                         phoneNumber={"+380969532132"}
                         email={"gorvatvit@ukr.net"}/>

          <PersonContact photo={person10}
                         title={`Начальник фінасового відділу`}
                         name="Любов Ляшенко" phoneNumber={"0500349565"}
                         email={"fv-miloverada@ukr.net"}/>

          <PersonContact photo={person2}
                         title={`Начальник відділу культури, туризму, молоді та спорту"`}
                         name="Олена Зеленська"
                         phoneNumber={"0991065741"}
                         email={"kultyra.miloverada@ukr.net"}/>

          <PersonContact photo={person4}
                         title={`Начальник відділу освіти`}
                         name="Тетяна Мельник"
                         phoneNumber={"0994007385"}
                         email={"osvita_mylove@ukr.net"}/>

          <PersonContact photo={person5}
                         title={`Cлужба у справах дітей Милівської сільської ради`}
                         name="Світлана Савіцька"
                         phoneNumber={"0994007385"}
                         email={"ssdmiloverada@ukr.net"}/>

          <PersonContact photo={person9}
                         title={`Начальник центру надання адмістративних послуг (ЦНАП)`}
                         name="Мар'яна Шніт" phoneNumber={"+380960394729"}
                         email={"marianashnit@ukr.net"}/>
        </Flex>
      </Flex>
  );
};


export type IContact = {
  id: number
  first_name: string;
  last_name: string;
  position: string;
  phone_number: string;
  email: string;
};


export {ContactsPage};