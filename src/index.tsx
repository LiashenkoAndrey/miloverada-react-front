import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import AuthProvider from "./AuthProvider";
import {Provider} from "react-redux";
import {store} from "./store";
import {Snowfall} from "react-snowfall";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
        <AuthProvider>
            <Provider store={store}>
                <Snowfall style={{zIndex: 100}}/>

                <App/>
            </Provider>
        </AuthProvider>
    </BrowserRouter>
);

