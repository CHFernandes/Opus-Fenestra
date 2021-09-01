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
    idOrganization: number;
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
            const { data } = await api.get('/login/');
            const responseUser = {
                id: data.id_person,
                name: data.name,
                email: data.email,
                userName: data.user,
                idPersona: data.id_persona,
                idOrganization: data.id_organization,
            };

            setUser(responseUser);
        }

        const { 'nextAuth.token': token } = parseCookies();

        if (token) {
            api.defaults.headers['authorization'] = `Bearer ${token}`;
            getUser();
        }
    }, []);

    async function signIn({ username, password }: SignInData) {
        const signInData = {
            user: username,
            password,
        };

        const { data } = await api.post('login', signInData);

        const token = data.accessToken;

        const responseUser = {
            id: data.returnPerson.id_person,
            name: data.returnPerson.name,
            email: data.returnPerson.email,
            userName: data.returnPerson.user,
            idPersona: data.returnPerson.id_persona,
            idOrganization: data.returnPerson.id_organization,
        };

        setCookie(undefined, 'nextAuth.token', token, {
            maxAge: 1 * 60 * 60 // 1 hour
        });

        api.defaults.headers['authorization'] = `Bearer ${token}`;

        setUser(responseUser);

        router.push('/Dashboard');
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
            {children}
        </AuthContext.Provider>
    );
}