import React, {useEffect, useState} from 'react';
import './App.css';
import {Route, Routes, useLocation} from "react-router-dom";
import Header from "./components/Header/Header";
import MainPage from "./pages/MainPage/MainPage";
import Footer from "./components/Footer/Footer";
import {App as AntdApp, ConfigProvider, Layout} from "antd";
import NewsPage from "./pages/NewsPage/NewsPage";
import AllNewsPage from "./pages/AllNewsPage/AllNewsPage";
import AllDocumentsPage from "./pages/AllDocumentsPage/AllDocumentsPage";
import ChatPage from "./pages/forum/ChatPage/ChatPage";
import AllForumTopicsPage from "./pages/forum/AllTopicsPage/AllForumTopicsPage";
import {AuthContext} from "./context/AuthContext";
import {useAuth0} from "@auth0/auth0-react";
import TopicPage from "./pages/forum/TopicPage/TopicPage";
import IsRegisteredCheckPage from "./pages/IsRegisteredCheckPage";
import PrivateChatPage from "./pages/forum/PrivateChatPage/PrivateChatPage";
import AllUsersPage from "./pages/AllUsersPage/AllUsersPage";
import AllInstitutionsPage from "./pages/AllInstitutionsPage/AllInstitutionsPage";
import InstitutionPage from "./pages/InstitutionPage/InstitutionPage";
import AddNewsPage from "./pages/AddNewsPage/AddNewsPage";
import locale from 'antd/es/locale/uk_UA';
import 'dayjs/locale/uk'
import 'bootstrap/dist/css/bootstrap.min.css';
import DocumentPage from "./pages/DocumentPage/DocumentPage";
import {useActions} from "./hooks/useActions";
import {getAppUser, UserDto} from "./API/services/UserService";
import {getForumUserByAppUserId} from "./API/services/forum/UserService";
import CreateNewForumUserProfileModal from "./components/CreateNewForumUserProfileModal/CreateNewForumUserProfileModal";
import AboutPage from "./pages/AboutPage/AboutPage";
import {ContactsPage} from "./pages/ContactsPage/ContactsPage";

function App() {
    const [jwt, setJwt] = useState<string>()
    const {getAccessTokenSilently, isAuthenticated, user} = useAuth0()
    const {setAdminMetadata, setUser} = useActions()
    const {pathname} = useLocation()
    const {setForumUser} = useActions()
    // const {forumUser} = useTypedSelector(state => state.user)
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

                      // Alias Token
                      colorBgContainer: '#ffffff',
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
                      <Routes>
                          <Route path={"/"} element={<MainPage/>}/>
                          <Route path={"/about"} element={<AboutPage/>}/>
                          <Route path={"/newsFeed/:id"} element={<NewsPage isPreview={false}/>}/>
                          <Route path={"/newsFeed/all"} element={<AllNewsPage/>}/>
                          <Route path={"/news/new"} element={<AddNewsPage/>}/>

                          <Route path={"/documents/all"} element={<AllDocumentsPage/>}/>
                          <Route path={"/documentGroup/:id/subGroup/:subGroupId"} element={<DocumentPage/>}/>
                          <Route path={"/documentGroup/:id"} element={<DocumentPage/>}/>

                          <Route path={"/contacts"} element={<ContactsPage/>}/>
                          <Route path={"/institutions"} element={<AllInstitutionsPage/>}/>
                          <Route path={"/institution/:id"} element={<InstitutionPage/>}/>

                          <Route path={"/forum/chat/:id"} element={<ChatPage/>}/>
                          <Route path={"/forum/chatWith/:userId"} element={<ChatPage/>}/>
                          <Route path={"/forum/topic/:id"} element={<TopicPage/>}/>
                          <Route path={"/forum"} element={<AllForumTopicsPage/>}/>
                          <Route path={"/resolveUser"} element={<IsRegisteredCheckPage/>}/>
                          <Route path={"/forum/user/:user1_id/chat"} element={<PrivateChatPage/>}/>
                          <Route path={"/forum/users"} element={<AllUsersPage/>}/>
                      </Routes>
                      <Footer/>
                  </Layout>
              </ConfigProvider>
          </AntdApp>
      </AuthContext.Provider>
  );
}

export default App;
