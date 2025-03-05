import React, {useEffect, useState} from 'react';
import './App.css';
import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import Header from "./components/shared/Header/Header";
import MainPage from "./pages/main/MainPage/MainPage";
import Footer from "./components/shared/Footer/Footer";
import {App as AntdApp, ConfigProvider, Layout, ThemeConfig} from "antd";
import NewsPage from "./pages/main/NewsPage/NewsPage";
import AllNewsPage from "./pages/main/AllNewsPage/AllNewsPage";
import AllDocumentsPage from "./pages/main/AllDocumentsPage/AllDocumentsPage";
import ChatPage from "./pages/forum/ChatPage/ChatPage";
import ForumPage from "./pages/forum/AllTopicsPage/ForumPage";
import {AuthContext} from "./context/AuthContext";
import {useAuth0} from "@auth0/auth0-react";
import TopicPage from "./pages/forum/TopicPage/TopicPage";
import IsRegisteredCheckPage from "./pages/main/IsRegisteredCheckPage";
import PrivateChatPage from "./pages/forum/PrivateChatPage/PrivateChatPage";
import AllUsersPage from "./pages/forum/AllUsersPage/AllUsersPage";
import AddNewsPage from "./pages/main/AddNewsPage/AddNewsPage";
import locale from 'antd/es/locale/uk_UA';
import 'dayjs/locale/uk'
import 'bootstrap/dist/css/bootstrap.min.css';
import DocumentPage from "./pages/main/DocumentPage/DocumentPage";
import {useActions} from "./hooks/useActions";
import {getAppUser, UserDto} from "./API/services/main/UserService";
import {getForumUserByAppUserId} from "./API/services/forum/UserService";
import CreateNewForumUserProfileModal
  from "./components/forum/CreateNewForumUserProfileModal/CreateNewForumUserProfileModal";
import AboutPage from "./pages/main/AboutPage/AboutPage";
import {ContactsPage} from "./pages/main/ContactsPage/ContactsPage";
import UnavailableServerErrorPage from "./pages/ErrorPages/UnavailableServerErrorPage";
import NotFoundPage from "./pages/ErrorPages/NotFoundPage";
import ManagePanePage from "./pages/main/ManagePanelPage/ManagePanePage";
import ApplicationPage from "./pages/main/ApplicationPage/ApplicationPage";
import ApplicationCreationPage from "./pages/main/ApplicationCreationPage/ApplicationCreationPage";

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: '#71092C',
    borderRadius: 2,

  },
  components: {
    Input: {
      fontFamily: "'Source Serif 4', serif"
    }
  }
}

function App() {
  const [jwt, setJwt] = useState<string>()
  const {getAccessTokenSilently, isAuthenticated, user} = useAuth0()
  const {setAdminMetadata, setUser} = useActions()
  const {pathname} = useLocation()
  const {setForumUser} = useActions()
  const [isForumUserRegistered, setIsForumUserRegistered] = useState<boolean | null>(null)

  const getForumUser = async (userId: string, jwt: string) => {
    const {data} = await getForumUserByAppUserId(userId, jwt)
    if (data) {
      if (data.isRegistered == false) {
        setIsForumUserRegistered(false);
      } else {
        setForumUser(data.forumUser)
      }
    }
  }

  useEffect(() => {
    if (pathname.includes('forum') && user?.sub && jwt) {
      getForumUser(user.sub, jwt)
    }
  }, [pathname, user?.sub, jwt]);

  const getJwt = async () => {
    const token = await getAccessTokenSilently();
    setJwt(token)
  }

  const getUser = async (userId: string, token: string) => {
    const {data, error} = await getAppUser(userId, token)
    if (data) {
      const userDto: UserDto = data;
      setUser(userDto.appUser)
      setAdminMetadata(userDto.adminMetadata)
    }
    if (error) {
      console.error("App user not found")
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      getJwt()
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (jwt) {
      if (user?.sub) {
        getUser(encodeURIComponent(user.sub), jwt)
      } else console.error("user null")
    }
  }, [jwt]);


  return (
      <AuthContext.Provider value={{jwt, setJwt}}>
        <AntdApp>
          <ConfigProvider locale={locale} theme={themeConfig}>
            <Layout>
              <Header/>
              {isForumUserRegistered !== null && !isForumUserRegistered &&
                  <CreateNewForumUserProfileModal/>
              }
              <Routes>
                <Route path={"/manage-panel/:section"} element={<ManagePanePage/>}/>
                <Route path="/manage-panel" element={<Navigate to="/manage-panel/news" replace/>}/>

                <Route path={"/server-unavailable"} element={<UnavailableServerErrorPage/>}/>

                <Route path={"/"} element={<MainPage/>}/>
                <Route path={"/about"} element={<AboutPage/>}/>
                <Route path={"/newsFeed/:id"} element={<NewsPage isPreview={false}/>}/>
                <Route path={"/newsFeed/all"} element={<AllNewsPage/>}/>
                <Route path={"/news/new"} element={<AddNewsPage/>}/>

                <Route path={"/documents/all"} element={<AllDocumentsPage/>}/>
                <Route path={"/documentGroup/:id/subGroup/:subGroupId"} element={<DocumentPage/>}/>
                <Route path={"/documentGroup/:id"} element={<DocumentPage/>}/>

                <Route path={"/contacts"} element={<ContactsPage/>}/>
                <Route path={"/application"} element={<ApplicationPage/>}/>
                <Route path={"/application-creation"} element={<ApplicationCreationPage/>}/>

                <Route path={"/forum/chat/:id"} element={<ChatPage/>}/>
                <Route path={"/forum/topic/:id"} element={<TopicPage/>}/>
                <Route path={"/forum"} element={<ForumPage/>}/>
                <Route path={"/resolveUser"} element={<IsRegisteredCheckPage/>}/>
                <Route path={"/forum/user/:receiverId/chat"} element={<PrivateChatPage/>}/>
                <Route path={"/forum/users"} element={<AllUsersPage/>}/>

                <Route path={"*"} element={<NotFoundPage/>}/>
              </Routes>
              <Footer/>
            </Layout>
          </ConfigProvider>
        </AntdApp>
      </AuthContext.Provider>
  );
}

export default App;
