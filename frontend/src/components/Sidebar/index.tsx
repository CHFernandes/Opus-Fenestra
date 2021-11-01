import React, { useRef, useEffect } from 'react';

import { IconButton } from '@material-ui/core';
import * as MI from '@material-ui/icons';

import Submenu from './submenu';
import { SidebarData } from './sidebarData';
import { useSidebar } from '../../contexts/SidebarContext';

import styles from './styles.module.scss';

export function Sidebar(): JSX.Element {
    const { sidebar, toggleSidebar } = useSidebar();

    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node) &&
                sidebar
            ) {
                toggleSidebar();
            }
        }

        document.addEventListener('mousedown', handleClick);
        return () => {
            document.removeEventListener('mousedown', handleClick);
        };
    }, [sidebarRef, sidebar]);

    return (
        <>
            <div
                ref={sidebarRef}
                className={styles.sidebarNav}
                style={{ left: sidebar ? '0 ' : '-100%' }}
            >
                <div className={styles.sidebarWrap}>
                    <div className={styles.linkWrapper}>
                        <IconButton onClick={toggleSidebar}>
                            <MI.Close />
                        </IconButton>
                    </div>
                    {SidebarData.map((item, index) => {
                        return (
                            <Submenu
                                item={item}
                                key={index}
                                toggle={toggleSidebar}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
}
