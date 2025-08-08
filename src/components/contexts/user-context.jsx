import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState({
        name: "홍길동",
        email: "test@example.com",
    });

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUserContext() {
    return useContext(UserContext);
}
