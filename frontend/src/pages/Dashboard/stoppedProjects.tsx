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

type StoppedProject = {
    projectId: number;
    name: string;
    description: string;
    completion: number;
    plannedStartDateString: string;
    plannedEndDateString: string;
    actualStartDateString: string;
    responsible: string;
};

export default function StoppedProjects(): JSX.Element {
    const { user } = useContext(AuthContext);
    const [stoppedProjects, setStoppedProjects] = useState<StoppedProject[]>(
        []
    );

    useEffect(() => {
        async function getStoppedProjects() {
            try {
                const { data: portfolioData } = await api.get(
                    `/portfolios/${user.idOrganization}`
                );
                const portfolioId = portfolioData.id_portfolio;

                const { data } = await api.get(
                    `/stoppedProjects/${portfolioId}`
                );

                if (data.length < 1) {
                    setStoppedProjects([]);
                    toast.error('Nenhum projeto está paralisado');
                    return;
                }

                const projects = data.map((project) => {
                    const projectObject = {
                        projectId: project.id_project,
                        name: project.name,
                        description: project.description,
                        completion: project.completion,
                        plannedStartDateString: format(
                            new Date(project.planned_start_date),
                            'dd/MM/yyyy',
                            {
                                locale: ptBR,
                            }
                        ),
                        plannedEndDateString: format(
                            new Date(project.planned_end_date),
                            'dd/MM/yyyy',
                            {
                                locale: ptBR,
                            }
                        ),
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

                setStoppedProjects(projects);
            } catch (error) {
                if (error.response) {
                    toast.error(error.response.data.message);
                }
            }
        }

        getStoppedProjects();
    }, []);

    return (
        <>
            <Card className={styles.cardRoot}>
                <CardContent>
                    <div className={styles.contentWrapper}>
                        <div className={styles.headerWrapper}>
                            <Typography className={styles.title} component='h1'>
                                Projetos Paralisados
                            </Typography>
                        </div>
                        <TableContainer>
                            <Table size='small'>
                                <TableBody>
                                    {stoppedProjects.map((project, index) => {
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
