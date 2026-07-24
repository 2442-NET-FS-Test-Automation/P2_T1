import { createContext, useReducer } from "react";
import type { ReactNode } from "react";
import { login as loginRequest } from "../api/auth";
import { decodeToken } from "./jwt";
import { getToken, setToken, clearToken } from "./storage";
import { authReducer, initialAuthState } from "./AuthReducer";
import type { AuthState } from "./AuthReducer";

interface AuthContextValue extends AuthState {
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

//Function to read the stored token before the first render
//That way the guard can read the athenticated user and not see InitialAuthState values
function InitAuthState(): AuthState {
    const token = getToken();
    const user = token ? decodeToken(token) : null;

    if (!user)
        return initialAuthState; // If nobody is logged in - no token in LocalStorage THEN return
                                 // initial auth state
    return {status: "authenticated", user, error: null}
}

export function AuthProvider ({ children }: {children: ReactNode}){

    const [state, dispatch] = useReducer(authReducer, undefined, InitAuthState);

    /* Old code, the one that didn't work in jonathan class
    useEffect(() => {
        const token = getToken();

        if(!token) return;
            
        const user = decodeToken(token);

        if (user) dispatch( { type: "login_success", user})
        else clearToken();
            
    }, []); */

    //Login method =======================
    async function login(email: string, password: string): Promise<boolean> {
        dispatch({type: "login_start"})

        try{
            const token = await loginRequest(email, password);
            const user = decodeToken(token);

            if (!user) throw new Error("token missing expected claims")
                
            setToken(token);
            dispatch({ type: "login_success", user})
            return true;

        } catch (err) {
            console.error("Login failed inside AuthContext:", err);
            dispatch({type: "login_failure", error: "Invalid email or password"})
            return false;
        }
    }

    function logout() {
        clearToken();
        dispatch({ type: "logout"});
    }

    return (
        <AuthContext.Provider value={{...state, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}