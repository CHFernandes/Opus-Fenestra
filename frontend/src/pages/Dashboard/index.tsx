import React, { useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import { AuthContext } from '../../contexts/AuthContext';

import styles from './styles.module.scss';
import Main from './main';
import LastEvaluations from './lastEvaluations';
import CurrentProjects from './currentProjects';
import ProjectsInRisk from './projectsInRisk';
import OverdueProjects from './overdueProjects';
import StoppedProjects from './stoppedProjects';
import LastStatusChangedProjects from './lastStatusChangedProjects';
import ProjectsChart from './projectsChart';

export default function Dashboard(): JSX.Element {
    const { isAuthenticated, user } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/Login');
            return;
        }
    }, []);

    return (
        <div className={styles.dashboardWrapper}>
            <div className={styles.dashboardHeader}>
                <h1>Seja muito bem-vindo {user && user.name + '!'}</h1>
                <h2>Abaixo estão as informações da sua organização</h2>
            </div>
            <div className={styles.dashboardGrid}>
                <div className={styles.dashboards}>
                    <Main />
                    <LastEvaluations />
                    <LastStatusChangedProjects />
                </div>
                <div className={styles.dashboards}>
                    <CurrentProjects />
                    <StoppedProjects />
                </div>
                <div className={styles.dashboards}>
                    <ProjectsInRisk />
                    <OverdueProjects />
                </div>
                <div className={styles.dashboardChart}>
                    <ProjectsChart />
                </div>
            </div>
        </div>
    );
}
