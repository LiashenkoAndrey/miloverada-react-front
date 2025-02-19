import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {checkServerHealth} from "../../API/Util";

const GlobalHealthCheck: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await checkServerHealth();
      } catch (error) {
        setTimeout(() => navigate("/server-unavailable"), 3000);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, [navigate]);

  return null;
};

export default GlobalHealthCheck;