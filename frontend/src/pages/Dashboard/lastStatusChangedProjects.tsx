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

type ChangedProject = {
    projectStatusId: number;
    personId: number;
    person: string;
    projectId: number;
    project: string;
    statusId: number;
    status: string;
    changedDate: Date;
    changedDateAsString: string;
};

export default function LastStatusChangedProjects(): JSX.Element {
    const { user } = useContext(AuthContext);
    const [changedProjects, setChangedProjects] = useState<ChangedProject[]>(
        []
    );

    useEffect(() => {
        async function getChangedProjects() {
            try {
                const { data: portfolioData } = await api.get(
                    `/portfolios/${user.idOrganization}`
                );

                const portfolioId = portfolioData.id_portfolio;

                const { data } = await api.get(
                    `/lastProjectsChanged/${portfolioId}`
                );

                if (data.length < 1) {
                    toast.error('Nenhum projeto foi mudado de estado');
                    setChangedProjects([]);
                    return;
                }

                const changedProjectsArray = data.map((project) => {
                    return {
                        projectStatusId: project.id_project_status,
                        personId: project.id_person,
                        person: project.person_name,
                        projectId: project.id_project,
                        project: project.project_name,
                        statusId: project.id_status,
                        status: project.status_name,
                        changedDate: new Date(project.changed_time),
                        changedDateAsString: format(
                            new Date(project.changed_time),
                            'dd/MM/yyyy',
                            {
                                locale: ptBR,
                            }
                        ),
                    };
                });

                setChangedProjects(changedProjectsArray);
            } catch (error) {
                if (error.response) {
                    toast.error(error.response.data.message);
                }
            }
        }

        getChangedProjects();
    }, []);

    return (
        <>
            <Card className={styles.cardRoot}>
                <CardContent>
                    <div className={styles.contentWrapper}>
                        <div className={styles.headerWrapper}>
                            <Typography className={styles.title} component='h1'>
                                Últimas atualizações de estado de projeto
                            </Typography>
                        </div>
                        <TableContainer>
                            <Table size='small'>
                                <TableBody>
                                    {changedProjects.map((project, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell align='left'>
                                                    {project.project}
                                                </TableCell>
                                                <TableCell align='left'>
                                                    Atualizado por -{' '}
                                                    {project.person}
                                                </TableCell>
                                                <TableCell align='left'>
                                                    No dia -{' '}
                                                    {
                                                        project.changedDateAsString
                                                    }
                                                </TableCell>
                                                <TableCell align='left'>
                                                    Com o estado de:{' '}
                                                    {project.status}
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
