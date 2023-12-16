import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Header from "./components/Header/Header";
import MainPage from "./pages/MainPage/MainPage";
import Footer from "./components/Footer/Footer";
import {Layout} from "antd";

function App() {
  return (
      <BrowserRouter>
          <Layout>
              <Header/>
              <Routes>
                  <Route path={"/"} element={<MainPage/>}/>
              </Routes>
              <Footer/>
          </Layout>
      </BrowserRouter>
  );
}

export default App;
