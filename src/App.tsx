import React, {useEffect, useState} from 'react';
import './App.css';
import {Route, Routes, useLocation} from "react-router-dom";
import Header from "./components/shared/Header/Header";
import MainPage from "./pages/main/MainPage/MainPage";
import Footer from "./components/shared/Footer/Footer";
import {App as AntdApp, ConfigProvider, Layout} from "antd";
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
import GlobalHealthCheck from "./components/util/GlobalHealthCheck";
import UnavailableServerErrorPage from "./pages/ErrorPages/UnavailableServerErrorPage";
import NotFoundPage from "./pages/ErrorPages/NotFoundPage";

function App() {
    const [jwt, setJwt] = useState<string>()
    const {getAccessTokenSilently, isAuthenticated, user} = useAuth0()
    const {setAdminMetadata, setUser} = useActions()
    const {pathname} = useLocation()
    const {setForumUser} = useActions()
    const [isForumUserRegistered, setIsForumUserRegistered] = useState<boolean | null>(null)

    const getForumUser = async (userId : string, jwt : string) => {
        const {data} = await getForumUserByAppUserId(userId, jwt)
        if (data) {
            console.log(data, data.isRegistered)
            if  (data.isRegistered == false) {
                console.log("forum user is not registered ")
                setIsForumUserRegistered(false);
            } else {
                console.log(data.forumUser)
                setForumUser(data.forumUser)
                console.log("forum user is registered")

            }
        }
        console.log("forum user", data)
    }

    useEffect(() => {
        if (pathname.includes('forum') && user?.sub && jwt) {
            console.log("load forum user ", user.sub)
            getForumUser(user.sub, jwt)
        }
    }, [pathname, user?.sub, jwt]);

    const getJwt = async () => {
        const token = await getAccessTokenSilently();
        setJwt(token)
    }
    const getUser = async (userId : string, token : string) => {
        const {data, error} = await getAppUser(userId, token)
        if (data) {
            const userDto : UserDto = data;
            console.log("user dto", data)
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
                console.log("Get App user")
                getUser(encodeURIComponent(user.sub), jwt)
            } else console.error("user null")
        }
    }, [jwt]);

  return (
      <AuthContext.Provider value={{jwt, setJwt}}>
          <AntdApp>
              <ConfigProvider locale={locale} theme={{
                  token : {
                      colorPrimary: '#71092C',
                      borderRadius: 2,

                  },
                  components : {
                      Input : {
                          fontFamily : "'Source Serif 4', serif"
                      }

                  }
              }}>

                  <Layout>
                      <Header/>
                      {isForumUserRegistered !== null && !isForumUserRegistered &&
                          <CreateNewForumUserProfileModal/>
                      }
                      <GlobalHealthCheck/>
                      <Routes>

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
                          <Route path={"/contacts"} element={<ContactsPage/>}/>

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
