import React from 'react';

import { Button, IconButton } from '@material-ui/core';
import * as MI from '@material-ui/icons';

import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';

import { useSidebar } from '../../contexts/SidebarContext';

import styles from './styles.module.scss';

export function Header() {
    const { toggleSidebar } = useSidebar();

    const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
        locale: ptBR,
    });

    return (
        <header className={styles.headerContainer}>
            <IconButton onClick={toggleSidebar}>
                <img src='/logo.svg' alt='Opus fenestra' />
            </IconButton>

            <p>Opus Fenestra</p>

            <span>{currentDate}</span>
            <div className={styles.user}>
                <span> Olá administrador</span>
                <Button color='primary' endIcon={<MI.ExitToApp />}>
                    <span>Sair</span>
                </Button>
            </div>
            
        </header>
    );
}