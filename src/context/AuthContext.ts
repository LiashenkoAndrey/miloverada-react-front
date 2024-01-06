import {createContext} from "react";

export interface AuthContextProps {
    jwt?: string | undefined;
    setJwt?: React.Dispatch<React.SetStateAction<string | undefined>>;
}
export const AuthContext = createContext<AuthContextProps>({jwt: undefined})