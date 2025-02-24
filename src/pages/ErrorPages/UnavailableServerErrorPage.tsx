import React from 'react';
import {Flex, Result} from "antd";

const UnavailableServerErrorPage = () => {

  return (
      <Flex style={{height: "100vh", backgroundColor: "white"}} align={"center"} justify={"center"}>
        <Result
                status="500"
                title="Сервер недоступний"
                subTitle="Вибачте, Сервер вимнено. Будь ласка спробуйте пізніше."
        />
      </Flex>
  );
};

export default UnavailableServerErrorPage;