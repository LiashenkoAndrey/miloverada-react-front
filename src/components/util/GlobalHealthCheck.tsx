import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {checkServerHealth} from "../../API/Util";

const GlobalHealthCheck: React.FC = () => {
  const navigate = useNavigate();

  const [isServerUp, setIsServerUp] = useState<boolean>(true)
  const [previousPage, setPreviousPage] = useState<string>("/");

  useEffect(() => {
    const checkHealth = async () => {
      const {data, error} = await checkServerHealth();
      if (data) {
        if (data.serverUp === true) {
          if (!isServerUp) {
            if (previousPage === "/server-unavailable") {
              console.log("Navigate to main page because server is up!");
              navigate("/");
            } else {
              console.log("Navigate back to the previous page");
              navigate(previousPage);
            }
          }
          setIsServerUp(true)
        } else {
          setIsServerUp(false)

          const location = window.location.pathname;
          console.log("Server is DOWN!")

          if (location !== "/server-unavailable") {
            console.log("location", location)
            setPreviousPage(location);
            navigate("/server-unavailable");
          }
        }
      } else {
        setIsServerUp(false)
        console.log(error)
      }
    }

    let interval = setInterval(() => checkHealth(), 20000)
    return () => {
      clearInterval(interval)
    }
  }, [isServerUp, navigate, previousPage]);

  return null;
};

export default GlobalHealthCheck;