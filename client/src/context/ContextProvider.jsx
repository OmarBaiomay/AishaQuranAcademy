import React, {createContext, useContext, useState} from "react";

const StatContext = createContext();

const inititalState = {
    chat: false,
    userProfile: false,
    notifications: false,
}

export const ContextProvider = ({children}) => {

    const [activeMenu, setActiveMenu] = useState(true);

    return (
        <StatContext.Provider value={
            {
                activeMenu,
                setActiveMenu,
            }
        }>
            {children}
        </StatContext.Provider>
    )
}

export const useStatContext = () => {
    return useContext(StatContext);
}