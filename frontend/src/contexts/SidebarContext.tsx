import React, { createContext, ReactNode, useContext, useState } from 'react';

type SidebarContextData = {
    sidebar: boolean;
    toggleSidebar: () => void;
};

type SidebarContextProviderProps = {
    children: ReactNode;
};

export const SidebarContext = createContext({} as SidebarContextData);

export function SidebarContextProvider({
    children,
}: SidebarContextProviderProps): JSX.Element {
    const [sidebar, setSidebar] = useState(false);

    function toggleSidebar() {
        setSidebar(!sidebar);
    }

    return (
        <SidebarContext.Provider
            value={{
                sidebar,
                toggleSidebar,
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
}

export const useSidebar = (): SidebarContextData => {
    return useContext(SidebarContext);
};
