import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import { Card, CardContent, Typography } from '@material-ui/core';
import * as MI from '@material-ui/icons/';

import { AuthContext } from '../../contexts/AuthContext';

import styles from './styles.module.scss';
import { api } from '../../services/api';


type DashboardForm = {
    organizationName: string;
    mission: string;
    values: string;
    vision: string;
}

export default function Dashboard():JSX.Element {
    const { isAuthenticated, user } = useContext(AuthContext);
    const router = useRouter();

    const startingform = {
        organizationName: '',
        mission: '',
        values: '',
        vision: '',
    };

    const [dashboardForm, setDashboardForm] = useState<DashboardForm>(startingform);

    useEffect(() => {
        async function getOrganization() {
            const { data } = await api.get(`/organizations/${user.idOrganization}`);

            const dashboardObject = {
                organizationName: data.name,
                mission: data.mission,
                values: data.values,
                vision: data.vision,
            };
    
          setDashboardForm(dashboardObject);
        }
        
        if (!isAuthenticated) {
            router.push('/Login');
            return;
        }

        getOrganization();
    }, []);

    return(
        <div className={styles.dashboardWrapper}>
            <div className={styles.dashboardHeader}>
                <h1>
                    Seja muito bem-vindo {user && user.name + '!'}
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