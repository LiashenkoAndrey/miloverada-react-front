import React from 'react';
import {Button, Flex, Result} from "antd";
import {useNavigate} from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
      <Flex style={{height: "100vh", backgroundColor: "white"}} align={"center"} justify={"center"}>
        <Result
            status="404"
            title="Сторінка не знайдена"
            extra={
              <Button type="primary" onClick={() => navigate("/")}>
                На головну сторінку
              </Button>
            }
        />
      </Flex>
  );
};

export default NotFoundPage;