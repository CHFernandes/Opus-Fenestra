import React, { useState, useEffect, useContext } from 'react';

import { Card, CardContent, Typography } from '@material-ui/core';
import * as MI from '@material-ui/icons/';

import { AuthContext } from '../../contexts/AuthContext';

import styles from './styles.module.scss';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

type DashboardForm = {
    organizationName: string;
    mission: string;
    values: string;
    vision: string;
};

export default function Main(): JSX.Element {
    const { user } = useContext(AuthContext);

    const startingform = {
        organizationName: '',
        mission: '',
        values: '',
        vision: '',
    };

    const [dashboardForm, setDashboardForm] =
        useState<DashboardForm>(startingform);

    useEffect(() => {
        async function getOrganization() {
            try {
                const { data } = await api.get(
                    `/organizations/${user.idOrganization}`
                );

                const dashboardObject = {
                    organizationName: data.name,
                    mission: data.mission,
                    values: data.values,
                    vision: data.vision,
                };

                setDashboardForm(dashboardObject);
            } catch (error) {
                toast.error(error.response?.data.message);
            }
        }

        getOrganization();
    }, []);

    return (
        <>
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
        </>
    );
}
