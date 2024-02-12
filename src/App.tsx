import React, {useEffect, useState} from 'react';
import './App.css';
import { Route, Routes, Navigate } from "react-router-dom";
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
import ContactsPage from "./pages/ContactsPage/ContactsPage";
import AllInstitutionsPage from "./pages/AllInstitutionsPage/AllInstitutionsPage";
import InstitutionPage from "./pages/InstitutionPage/InstitutionPage";
import AddNewsPage from "./pages/AddNewsPage/AddNewsPage";
import locale from 'antd/es/locale/uk_UA';
import 'dayjs/locale/uk'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [jwt, setJwt] = useState<string>()
    const {getAccessTokenSilently, isAuthenticated} = useAuth0()
    useEffect(() => {
        const getJwt = async () => {
            const token = await getAccessTokenSilently();
            setJwt(token)
        }

        if (isAuthenticated) {
            getJwt()
        }
    }, [isAuthenticated]);

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
                      <Routes>
                          <Route path={"/"} element={<MainPage/>}/>
                          <Route path={"/newsList/:id"} element={<NewsPage isPreview={false}/>}/>
                          <Route path={"/news/all"} element={<AllNewsPage/>}/>
                          <Route path={"/news/new"} element={<AddNewsPage/>}/>


                          <Route path={"/documents/all"} element={<AllDocumentsPage/>}/>
                          <Route path={"/chat/:id"} element={<ChatPage/>}/>
                          <Route path={"/topic/:id"} element={<TopicPage/>}/>
                          <Route path={"/contacts"} element={<ContactsPage/>}/>
                          <Route path={"/institutions"} element={<AllInstitutionsPage/>}/>
                          <Route path={"/institution/:id"} element={<InstitutionPage/>}/>

                          <Route path={"/forum"} element={<AllForumTopicsPage/>}/>
                          <Route path={"/resolveUser"} element={<IsRegisteredCheckPage/>}/>
                          <Route path={"/forum/user/:user1_id/chat"} element={<PrivateChatPage/>}/>
                          <Route path={"/forum/users"} element={<AllUsersPage/>}/>
                          <Route path={"/*"} element={<Navigate to={"/"}/>}/>
                      </Routes>
                      <Footer/>
                  </Layout>
              </ConfigProvider>
          </AntdApp>
      </AuthContext.Provider>
  );
}

export default App;
