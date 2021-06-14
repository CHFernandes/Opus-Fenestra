import React from 'react';

import { IconButton } from '@material-ui/core';
import * as MI from '@material-ui/icons';

import Submenu from './submenu';
import { SidebarData } from './sidebarData';
import { useSidebar } from '../../contexts/SidebarContext';

import styles from './styles.module.scss';

export function Sidebar()  {
    const {
        sidebar,
        toggleSidebar,
    } = useSidebar();
  
    return (
      <>
        <div className={styles.sidebarNav} style={{ left: sidebar ? '0 ': '-100%' }}>
            <div className={styles.sidebarWrap}>
                <div className={styles.linkWrapper}>
                    <IconButton onClick={toggleSidebar}>
                        <MI.Close />
                    </IconButton>
                </div>
                {SidebarData.map((item, index) => {
                    return <Submenu item={item} key={index} />;
                })}
            </div>
        </div>
      </>
    );
};