import React, {FC} from 'react';
import type {StatisticProps} from 'antd';
import {Button, Flex, Statistic} from "antd";
import CountUp from 'react-countup';
import classes from './ApplicationPage.module.css'

import {useNavigate} from "react-router-dom";
import ApplicationPageTemplate
  from "../../../components/main/ApplicationPageTemplate/ApplicationPageTemplate";

interface ApplicationPageProps {
}

const formatter: StatisticProps['formatter'] = (value) => (
    <CountUp end={value as number} separator=","/>
);

const ApplicationPage: FC<ApplicationPageProps> = (props) => {
  const nav = useNavigate()

  return (
      <ApplicationPageTemplate>
        <div className={classes.citizenAppeal}>
          <h2 style={{textAlign: "center"}}>📌 Шановні громадяни!</h2>
          <p style={{textAlign: "center"}}>Ви маєте право звертатися до Милівської сільської
            військової адміністрації з пропозиціями, заявами та скаргами щодо питань, які вас
            хвилюють.</p>

          <ul>
            <li>🔹 Відповідно до <strong>статті 40 Конституції України</strong> та <strong>Закону
              України «Про звернення громадян»</strong>, ваше звернення буде розглянуто у
              встановлений законом строк.
            </li>
            <li>🔹 Ви можете подати <strong>індивідуальне або колективне звернення</strong> у
              письмовій формі чи в електронному вигляді.
            </li>
            <li>🔹 Відповідь на ваше звернення буде надана у спосіб, який ви зазначите під час
              подання.
            </li>
          </ul>

          <Flex vertical gap={10} align={"center"}>
            <p><strong>📥 Натисніть кнопку нижче, щоб оформити звернення:</strong></p>

            <Button style={{width: 200, fontSize: 16}} onClick={() => nav('/application-creation')}
                    type={"primary"}>Оформити звернення</Button>
          </Flex>
        </div>

        <Statistic formatter={formatter} title="Отриманих звернень" value={98}/>
      </ApplicationPageTemplate>
  );
};

export default ApplicationPage;