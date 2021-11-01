import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import {
    Card,
    CardContent,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Tooltip,
    Typography,
} from '@material-ui/core';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { AuthContext } from '../../contexts/AuthContext';
import * as MI from '@material-ui/icons/';

import styles from './styles.module.scss';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

type OverdueProject = {
    projectId: number;
    name: string;
    description: string;
    completion: number;
    plannedStartDateString: string;
    plannedEndDateString: string;
    actualStartDateString: string;
    responsible: string;
};

export default function OverdueProjects(): JSX.Element {
    const { user } = useContext(AuthContext);
    const [overdueProjects, setOverdueProjects] = useState<OverdueProject[]>(
        []
    );
    const router = useRouter();

    useEffect(() => {
        async function getOverdueProjects() {
            try {
                const { data: portfolioData } = await api.get(
                    `/portfolios/${user.idOrganization}`
                );
                const portfolioId = portfolioData.id_portfolio;

                const { data } = await api.get(
                    `/overdueProjects/${portfolioId}`
                );

                if (data.length < 1) {
                    setOverdueProjects([]);
                    toast.error('Nenhum projeto está atrasado');
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

                setOverdueProjects(projects);
            } catch (error) {
                toast.error(error.response?.data.message);
            }
        }

        getOverdueProjects();
    }, []);

    function handleEdit(id: number) {
        const idCriteria = String(id);
        router.push(`/RegisterProjects/${idCriteria}`);
    }

    return (
        <>
            <Card className={styles.cardRoot}>
                <CardContent>
                    <div className={styles.contentWrapper}>
                        <div className={styles.titleWrapper}>
                            <Typography className={styles.title} component='h1'>
                                Projetos atrasados
                            </Typography>
                        </div>
                        <TableContainer>
                            <Table size='small'>
                                <TableBody>
                                    {overdueProjects.map((project, index) => {
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
                                                <TableCell align='right'>
                                                    <Tooltip title='Visualizar Projeto'>
                                                        <IconButton
                                                            onClick={() =>
                                                                handleEdit(
                                                                    project.projectId
                                                                )
                                                            }
                                                            aria-label='Editar Projeto'
                                                        >
                                                            <MI.Visibility />
                                                        </IconButton>
                                                    </Tooltip>
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
