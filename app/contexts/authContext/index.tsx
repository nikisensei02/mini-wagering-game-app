import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth } from '../../firebase/firebase';
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

interface AuthContextProps {
    currentUser: FirebaseUser | null;
    userLoggedIn: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, initializeUser);
        return unSubscribe;
    }, []);

    const initializeUser = (user: FirebaseUser | null) => {
        if (user) {
            setCurrentUser({ ...user });
            setUserLoggedIn(true);
        } else {
            setCurrentUser(null);
            setUserLoggedIn(false);
        }
        setLoading(false);
    };

    const value: AuthContextProps = {
        currentUser,
        userLoggedIn,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
