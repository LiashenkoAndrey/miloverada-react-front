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
        <Flex wrap={"wrap"} style={{marginTop: 20, maxWidth: 1200}} gap={20}>

          <PersonContact photo={person1} title={`Директор КНП "Качкарівський ЦПМСД"`}
                         name="Логвиненко_Олена_Миколаївна.jpg"/>
          <PersonContact photo={person2}
                         title={`Начальник відділу культури, туризму, молоді та спорту"`}
                         name="Зеленська Олена Валеріївна"/>
          <PersonContact photo={person3} title={`Cтароста Качкарівського старостату`}
                         name="Копил Людмила Анатоліївна"/>
          <PersonContact photo={person4} title={`Начальник відділу освіти`}
                         name="Мельник Тетяна Володимирівна"/>
          <PersonContact photo={person5} title={`Cлужба у справах дітей Милівської сільської ради`}
                         name="Савіцька Світлана Сергіївна"/>
          <PersonContact photo={person6} title={`Cтароста Дудчанського старостату`}
                         name="Горюшкін Сергій Васильович"/>
          <PersonContact photo={person7} title={`Відділ державної реєстрації речових майнових прав`}
                         name="Олександр Розковерко"/>
          <PersonContact photo={person8}
                         title={`Начальник відділу земельних відносин, комунальної власності, містобудування та архітектури`}
                         name="Горват Віталій Васильович"/>
          <PersonContact photo={person9}
                         title={`Начальник центру надання адмістративних послуг (ЦНАП)`}
                         name="Мар'яна Шніт"/>
          <PersonContact photo={person12} title={`Староста  Новокаїрського старостинського округу`}
                         name="Олена Логвиненко"/>
          <PersonContact photo={person10} title={`Начальник фінасового відділу`}
                         name="Любов Ляшенко"/>
          <PersonContact photo={person11} title={`Начальник сільської військової адміністрації`}
                         name="Любов Мінько"/>
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