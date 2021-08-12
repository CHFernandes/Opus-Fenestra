import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { setCookie, parseCookies } from 'nookies';
import { api } from '../services/api';

type AuthContextProviderProps = {
    children: ReactNode;
}

type User = {
    id: number;
    name: string;
    email: string;
    userName: string;
    idPersona: number;
    personaType: string;
}

type SignInData = {
    username: string;
    password: string;
}

type AuthContextType = {
    user: User;
    isAuthenticated: boolean;
    signIn: (data: SignInData) => Promise<void>;
}

export const AuthContext = createContext( {} as AuthContextType);

export function AuthContextProvider({ children }: AuthContextProviderProps): JSX.Element {
    const [user, setUser] = useState<User | null>(null);

    const isAuthenticated = !!user;

    const router = useRouter();

    useEffect(() => {
        async function getUser() {
            // const { data } = await api.get('/userLogin/');
            // const responseUser = {
            //     id: data.idUser,
            //     name: data.name,
            //     email: data.email,
            //     userName: data.userName,
            //     idPersona: data.idPersona,
            //     personaType: data.personaType,
            // };

            const responseUser = {
                id: 0,
                name: 'Administrador',
                email: 'admin@admin.com',
                userName: 'admin',
                idPersona: 0,
                personaType: 'Administrador',
            };

            setUser(responseUser);
        }

        const { 'nextauth.token': token } = parseCookies();

        if (token) {
            getUser();
        }
    }, []);

    async function signIn({ username, password }: SignInData) {
        // const signInData = {
        //     username,
        //     password,
        // };

        // const { data } = await api.post('signIn', signInData);

        // const token = data.token;

        // const responseUser = {
        //     id: data.idUser,
        //     name: data.name,
        //     email: data.email,
        //     userName: data.userName,
        //     idPersona: data.idPersona,
        //     personaType: data.personaType,
        // };

        const token = 'token_teste';

        const responseUser = {
            id: 0,
            name: 'Administrador',
            email: 'admin@admin.com',
            userName: 'admin',
            idPersona: 0,
            personaType: 'Administrador',
        };

        setCookie(undefined, 'nextauth.token', token, {
            maxAge: 60 * 30 // 30 minutes
        });

        api.defaults.headers['Authorization'] = `Bearer ${token}`;

        setUser(responseUser);

        router.push('/Dashboard');
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
            {children}
        </AuthContext.Provider>
    );
}