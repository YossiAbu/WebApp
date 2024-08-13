import {createContext , useEffect, useReducer} from 'react';
import AuthReducer from './AuthReducer.js';

const INITIAL_STATE = {
    currentUser: JSON.parse(localStorage.getItem("user")) || null,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({children}) =>{
    const [user,dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    useEffect(()=>{
        localStorage.setItem("user",JSON.stringify(user.currentUser))
    },[user.currentUser])

    return (
        <AuthContext.Provider value={{currentUser: user.currentUser, dispatch}}>
            {children}
        </AuthContext.Provider>
    );
};