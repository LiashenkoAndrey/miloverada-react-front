import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./components/Header/Header";
import MainPage from "./pages/MainPage/MainPage";
import Footer from "./components/Footer/Footer";
import {Layout} from "antd";
import NewsPage from "./pages/NewsPage/NewsPage";
import AllNewsPage from "./pages/AllNewsPage/AllNewsPage";
import AllDocumentsPage from "./pages/AllDocumentsPage/AllDocumentsPage";
import ChatPage from "./pages/forum/ChatPage/ChatPage";
import AllForumTopicsPage from "./pages/forum/AllTopicsPage/AllForumTopicsPage";

function App() {
  return (
      <BrowserRouter>
          <Layout>
              <Header/>
              <Routes>
                  <Route path={"/"} element={<MainPage/>}/>
                  <Route path={"/news/:id"} element={<NewsPage/>}/>
                  <Route path={"/news/all"} element={<AllNewsPage/>}/>
                  <Route path={"/documents/all"} element={<AllDocumentsPage/>}/>
                  <Route path={"/chat/:id"} element={<ChatPage/>}/>
                  <Route path={"/forum"} element={<AllForumTopicsPage/>}/>
              </Routes>
              <Footer/>
          </Layout>
      </BrowserRouter>
  );
}

export default App;
