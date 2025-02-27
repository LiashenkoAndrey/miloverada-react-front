import React, {FC, useEffect, useState} from 'react';
import {Badge, Flex} from "antd";
import classes from "./Header.module.css";
import {useTypedSelector} from "../../../hooks/useTypedSelector";
import {useAuth0} from "@auth0/auth0-react";
import UserInfoDrawer from "../UserInfoDrawer/UserInfoDrawer";

interface UserIconProps {
}

const UserIcon: FC<UserIconProps> = (props) => {
  const {unreadNotificationNumber} = useTypedSelector(state => state.user)
  const [isUserDrawerActive, setIsUserDrawerActive] = useState<boolean>(false)
  const {user} = useAuth0()

  return (
      <Flex
          align={"center"}
          vertical
          className={classes.headNavItem}

          style={{background: "none", padding: 0}}
      >
        <UserInfoDrawer isUserDrawerActive={isUserDrawerActive}
                        setIsUserDrawerActive={setIsUserDrawerActive}
        />

        <Badge count={unreadNotificationNumber}>
          <img onClick={() => setIsUserDrawerActive(true)}
               className={classes.userIcon}
               src={user?.picture} alt=""/>
        </Badge>
        <span style={{color: "white"}}>{user?.firstName}</span>
      </Flex>
  );
};

export default UserIcon;