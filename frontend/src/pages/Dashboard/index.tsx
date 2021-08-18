import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import { Card, CardContent, Typography } from '@material-ui/core';
import * as MI from '@material-ui/icons/';

import { AuthContext } from '../../contexts/AuthContext';

import styles from './styles.module.scss';


type DashboardForm = {
    organizationName: string;
    mission: string;
    values: string;
    vision: string;
}

export default function Dashboard():JSX.Element {
    const { isAuthenticated } = useContext(AuthContext);
    const router = useRouter();

    const startingform = {
        organizationName: '',
        mission: '',
        values: '',
        vision: '',
    };

    const [dashboardForm, setDashboardForm] = useState<DashboardForm>(startingform);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/');
            return;
        }

        const dashboardObject = {
            organizationName: 'Organização De Teste para criação de dashboard',
            mission: 'A missão dessa organização é ajudar o dev a montar a dashboard',
            values: 'Os valores dessa organização é ajudar o dev a montar a dashboard',
            vision: 'A visão dessa organização é ajudar o dev a montar a dashboard',
        };

      setDashboardForm(dashboardObject);
    }, []);

    return(
        <div className={styles.dashboardWrapper}>
            <div className={styles.dashboardHeader}>
                <h1>
                    Seja muito bem-vindo Administrador!
                </h1>
                <h2>
                    Abaixo estão as informações da sua organização
                </h2>
            </div>
            <Card className={styles.cardRoot}>
                <CardContent>
                    <div className={styles.contentWrapper}>
                        <div className={styles.titleWrapper}>
                            <MI.Business />
                            <Typography className={styles.title} component='h2'>
                                Nome da Organização
                            </Typography>
                        </div>
                        
                        <Typography variant='body2' component='p'>
                            {dashboardForm.organizationName}
                        </Typography>
                    </div>
                    <div className={styles.contentWrapper}>
                        <div className={styles.titleWrapper}>
                            <MI.AssignmentTurnedIn />
                            <Typography className={styles.title} component='h2'>
                                Missão
                            </Typography>
                        </div>
                        <Typography variant='body2' component='p'>
                            {dashboardForm.mission}
                        </Typography>
                    </div>
                    <div className={styles.contentWrapper}>
                        <div className={styles.titleWrapper}>
                            <MI.Visibility />
                            <Typography className={styles.title} component='h2'>
                                Visão
                            </Typography>
                        </div>
                        <Typography variant='body2' component='p'>
                            {dashboardForm.vision}
                        </Typography>
                    </div>
                    <div className={styles.contentWrapper}>
                        <div className={styles.titleWrapper}>
                            <MI.PlaylistAddCheck />
                            <Typography className={styles.title} component='h2'>
                                Valores
                            </Typography>
                        </div>
                        <Typography variant='body2' component='p'>
                            {dashboardForm.values}
                        </Typography>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}