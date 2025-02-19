import React from 'react';
import {Button, Flex, Result} from "antd";
import {useNavigate} from "react-router-dom";

const UnavailableServerErrorPage = () => {
  const navigate = useNavigate();

  return (
      <Flex style={{height: "100vh", backgroundColor: "white"}} align={"center"} justify={"center"}>
        <Result
                status="500"
                title="Сервер недоступний"
                subTitle="Вибачте, Сервер вимнено. Будь ласка спробуйте пізніше."
                extra={
                  <Button type="primary" onClick={() => navigate("/")}>
                    Спробувати ще раз
                  </Button>
                }
        />
      </Flex>
  );
};

export default UnavailableServerErrorPage;