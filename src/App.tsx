import React, {useEffect, useState} from 'react';
import './App.css';
import {Route, Routes} from "react-router-dom";
import Header from "./components/Header/Header";
import MainPage from "./pages/MainPage/MainPage";
import Footer from "./components/Footer/Footer";
import {App as AntdApp, Layout} from "antd";
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
              <Layout>
                  <Header/>
                  <Routes>
                      <Route path={"/"} element={<MainPage/>}/>
                      <Route path={"/news/:id"} element={<NewsPage/>}/>
                      <Route path={"/news/all"} element={<AllNewsPage/>}/>
                      <Route path={"/documents/all"} element={<AllDocumentsPage/>}/>
                      <Route path={"/chat/:id"} element={<ChatPage/>}/>
                      <Route path={"/topic/:id"} element={<TopicPage/>}/>
                      <Route path={"/forum"} element={<AllForumTopicsPage/>}/>
                      <Route path={"/resolveUser"} element={<IsRegisteredCheckPage/>}/>
                      <Route path={"/forum/user/:user1_id/chat"} element={<PrivateChatPage/>}/>
                  </Routes>
                  <Footer />
              </Layout>
          </AntdApp>
      </AuthContext.Provider>
  );
}

export default App;
