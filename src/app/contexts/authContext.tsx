// "use client";

// import { createContext, useMemo, useCallback } from "react";
// import Cookies from "js-cookie";

// export type AuthContextProviderProps = {
//   children: React.ReactNode;
// };

// type AuthContextType = {
//   Login: (authToken: string) => void;
//   Logout: () => void;
// };

// export const AuthContext = createContext<AuthContextType>({
//   Login: () => {},
//   Logout: () => {},
// });

// export default function AuthContextProvider({
//   children,
// }: AuthContextProviderProps) {
//   const Login = useCallback((authToken: string) => {
//     Cookies.set("authToken", authToken);
//   }, []);

//   const Logout = useCallback(() => {
//     Cookies.remove("authToken");
//   }, []);

//   const value = useMemo(() => ({ Login, Logout }), [Login, Logout]);

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }
