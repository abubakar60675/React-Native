import { getCurrentUser } from '@/lib/appwrite';
import React, { createContext, useContext, useEffect, useState } from 'react';


interface GlobalContextProps {
    isLoading: boolean;
    isLoggedIn: boolean;
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    user: any;
    setUser: React.Dispatch<React.SetStateAction<any>>;
}

interface Props {
    children: React.ReactNode;
}
const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

const GlobalProvider: React.FC<Props> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        getCurrentUser().then((res) => {
            if (res) {
                setIsLoggedIn(true);
                setUser(res);
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        }).catch((error) => {
            console.log(error);
            setIsLoggedIn(false);
        }).finally(() => {
            setIsLoading(false);
        })
    }, []);

    return (
        <>
            <GlobalContext.Provider value={{
                isLoading,
                isLoggedIn,
                user,
                setIsLoggedIn,
                setUser
            }}>
                {children}
            </GlobalContext.Provider>
        </>
    )
}

export default GlobalProvider;

export const useGlobalContext = (): GlobalContextProps => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobalContext must be used within an AppProvider");
    }
    return context;
};