import React, {FC, ReactNode} from 'react';
import {useNavigate} from "react-router-dom";
import {AppState, Auth0Provider} from "@auth0/auth0-react";

interface AuthProviderProps {
    children? : ReactNode
}

const AuthProvider : FC<AuthProviderProps> = ({children}) => {
    const navigate = useNavigate();

    const domain = process.env.REACT_APP_AUTH0_DOMAIN;
    const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_AUTH0_CALLBACK_URL;


    const onRedirectCallback = (appState : AppState | undefined) => {
        navigate(appState?.returnTo || window.location.pathname);
    };

    if (!(domain && clientId && redirectUri)) {
        return null;
    }

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                audience: "https://miloverada-api",
                redirect_uri: redirectUri,
            }}
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    );
};

export default AuthProvider;