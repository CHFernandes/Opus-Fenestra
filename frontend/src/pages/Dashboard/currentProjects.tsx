import React, { useState, useEffect, useContext } from 'react';

import {
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from '@material-ui/core';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { AuthContext } from '../../contexts/AuthContext';

import styles from './styles.module.scss';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

type RunningProject = {
    projectId: number;
    name: string;
    description: string;
    completion: number;
    plannedStartDate: Date;
    plannedStartDateString: string;
    plannedEndDate: Date;
    plannedEndDateString: string;
    actualStartDate: Date;
    actualStartDateString: string;
    responsible: string;
};

export default function CurrentProjects(): JSX.Element {
    const { user } = useContext(AuthContext);
    const [runningProjects, setRunningProjects] = useState<RunningProject[]>(
        []
    );

    useEffect(() => {
        async function getRunningProjects() {
            try {
                const { data: portfolioData } = await api.get(
                    `/portfolios/${user.idOrganization}`
                );
                const portfolioId = portfolioData.id_portfolio;

                const { data } = await api.get(
                    `/runningProjects/${portfolioId}`
                );

                if (data.length < 1) {
                    setRunningProjects([]);
                    toast.error('Nenhum projeto está em execução');
                    return;
                }

                const projects = data.map((project) => {
                    const projectObject = {
                        projectId: project.id_project,
                        name: project.name,
                        description: project.description,
                        completion: project.completion,
                        plannedStartDate: new Date(project.planned_start_date),
                        plannedStartDateString: format(
                            new Date(project.planned_start_date),
                            'dd/MM/yyyy',
                            {
                                locale: ptBR,
                            }
                        ),
                        plannedEndDate: new Date(project.planned_end_date),
                        plannedEndDateString: format(
                            new Date(project.planned_end_date),
                            'dd/MM/yyyy',
                            {
                                locale: ptBR,
                            }
                        ),
                        actualStartDate: new Date(project.actual_start_date),
                        actualStartDateString: format(
                            new Date(project.actual_start_date),
                            'dd/MM/yyyy',
                            {
                                locale: ptBR,
                            }
                        ),
                        responsible: project.responsible,
                    };

                    return projectObject;
                });

                setRunningProjects(projects);
            } catch (error) {
                if (error.response) {
                    toast.error(error.response.data.message);
                }
            }
        }

        getRunningProjects();
    }, []);

    return (
        <>
            <Card className={styles.cardRoot}>
                <CardContent>
                    <div className={styles.contentWrapper}>
                        <div className={styles.headerWrapper}>
                            <Typography className={styles.title} component='h1'>
                                Projetos em execução
                            </Typography>
                        </div>
                        <TableContainer>
                            <Table size='small'>
                                <TableBody>
                                    {runningProjects.map((project, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell align='left'>
                                                    {project.name}
                                                </TableCell>
                                                <TableCell align='left'>
                                                    Início previsto -{' '}
                                                    {
                                                        project.plannedEndDateString
                                                    }
                                                </TableCell>
                                                <TableCell align='left'>
                                                    Início real -{' '}
                                                    {
                                                        project.actualStartDateString
                                                    }
                                                </TableCell>
                                                <TableCell align='left'>
                                                    Finalização prevista -{' '}
                                                    {
                                                        project.plannedEndDateString
                                                    }
                                                </TableCell>
                                                <TableCell align='left'>
                                                    Progresso -{' '}
                                                    {project.completion}%
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
