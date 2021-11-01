import React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';

import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { SidebarContextProvider } from '../contexts/SidebarContext';
import { AuthContextProvider } from '../contexts/AuthContext';

import { Toaster } from 'react-hot-toast';

import '../styles/global.scss';
import styles from '../styles/app.module.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <>
            <Head>
                <meta
                    name='viewport'
                    content='minimum-scale=1, initial-scale=1, width=device-width'
                />
            </Head>
            <AuthContextProvider>
                <SidebarContextProvider>
                    <div className={styles.wrapper}>
                        <Sidebar />
                        <main>
                            <Header />
                            <Component {...pageProps} />
                            <Toaster
                                position='bottom-center'
                                toastOptions={{
                                    duration: 6000,
                                    success: {
                                        style: {
                                            background: 'green',
                                            color: 'white',
                                        },
                                    },
                                    error: {
                                        style: {
                                            background: 'red',
                                            color: 'white',
                                        },
                                    },
                                }}
                            />
                        </main>
                    </div>
                </SidebarContextProvider>
            </AuthContextProvider>
        </>
    );
}

export default MyApp;
