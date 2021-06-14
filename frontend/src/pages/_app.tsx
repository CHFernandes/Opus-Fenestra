import React from "react";
import Head from 'next/head'

import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { SidebarContextProvider } from '../contexts/SidebarContext';

import '../styles/global.scss'
import styles from '../styles/app.module.scss';

function MyApp({ Component, pageProps }) {
  return (
    <>
    <Head>
      <meta
        name='viewport'
        content='minimum-scale=1, initial-scale=1, width=device-width'
      />
    </Head>
    <SidebarContextProvider>
      <div className={styles.wrapper}>
        <Sidebar />
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
      </div>
    </SidebarContextProvider>
    </>
  );
}

export default MyApp
