import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {checkServerHealth, secToMilisec} from "../../API/Util";

const GlobalHealthCheck: React.FC = () => {
  const navigate = useNavigate();
  const timeout = parseInt(process.env.REACT_APP_HEALTH_CHECK_TIMEOUT_IN_SEC ?? "10", 10);
  const [isServerUp, setIsServerUp] = useState<boolean>(true)
  const [previousPage, setPreviousPage] = useState<string>("/");

  const checkHealth = async (isServerUp: boolean,
                             setIsServerUp: React.Dispatch<React.SetStateAction<boolean>>,
                             previousPage: string,
                             setPreviousPage: React.Dispatch<React.SetStateAction<string>>
  ) => {
    try {
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
    } catch (e) {
      console.error("Health check error")
    }
  }

  useEffect(() => {

    checkHealth(isServerUp, setIsServerUp, previousPage, setPreviousPage)
    let interval = setInterval(
        () => checkHealth(isServerUp, setIsServerUp, previousPage, setPreviousPage),
        secToMilisec(timeout)
    )
    return () => {
      clearInterval(interval)
    }
  }, [isServerUp, navigate, previousPage]);

  return null;
};

export default GlobalHealthCheck;
