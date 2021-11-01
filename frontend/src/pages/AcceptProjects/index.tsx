import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import { IconButton, Tooltip } from '@material-ui/core';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import * as MI from '@material-ui/icons';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { api } from '../../services/api';
import styles from './styles.module.scss';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

type EvaluatedProject = {
    id: number;
    idPortfolio: number;
    name: string;
    description: string;
    grade: number;
    plannedStartDateAsString: string;
    plannedEndDateAsString: string;
};

export default function AcceptProjects(): JSX.Element {
    const { isAuthenticated, user } = useContext(AuthContext);
    const [project, setProjects] = useState<EvaluatedProject[]>([]);

    useEffect(() => {
        async function getProjects() {
            try {
                const { data: portfolioData } = await api.get(
                    `/portfolios/${user.idOrganization}`
                );
                const portfolioId = portfolioData.id_portfolio;
                const { data } = await api.get(
                    `/evaluatedProjects/${portfolioId}`
                );

                if (data.length < 1) {
                    setProjects([]);
                    toast.error('Todos os projetos foram avaliados');
                    return;
                }

                const projects = data.map((project) => {
                    return {
                        id: project.id_project,
                        idPortfolio: project.id_portfolio,
                        name: project.name,
                        description: project.description,
                        grade: project.grade,
                        plannedStartDateAsString: format(
                            new Date(project.planned_start_date),
                            'dd/MM/yyyy',
                            {
                                locale: ptBR,
                            }
                        ),
                        plannedEndDateAsString: format(
                            new Date(project.planned_end_date),
                            'dd/MM/yyyy',
                            {
                                locale: ptBR,
                            }
                        ),
                    };
                });

                setProjects(projects);
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }

        if (!isAuthenticated) {
            router.push('/Login');
            return;
        }

        getProjects();
    }, []);

    const router = useRouter();

    const projectList = project;

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            flex: 1,
        },
        {
            field: 'name',
            headerName: 'Nome do Projeto',
            flex: 2,
        },
        {
            field: 'description',
            headerName: 'Descrição',
            flex: 2.5,
        },
        {
            field: 'plannedStartDateAsString',
            headerName: 'Data de inicio planejada',
            flex: 1.8,
        },
        {
            field: 'plannedEndDateAsString',
            headerName: 'Data de fim planejada',
            flex: 1.8,
        },
        {
            field: 'grade',
            headerName: 'Nota da avaliação',
            flex: 1.5,
        },
        {
            field: '',
            headerName: '',
            sortable: false,
            headerAlign: 'center',
            align: 'center',
            flex: 1.25,
            disableClickEventBubbling: true,
            renderCell: function getCell(params) {
                const onClickApprove = () => {
                    return handleApprove(params.row.id);
                };

                const onClickAsk = () => {
                    return handleAsk(params.row.id);
                };

                const onClickReject = () => {
                    return handleReject(params.row.id);
                };

                return (
                    <>
                        <Tooltip title='Aprovar Projeto'>
                            <IconButton
                                className={styles.approve}
                                onClick={onClickApprove}
                                aria-label='Aprovar Projeto'
                            >
                                <MI.Check />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Pedir mais informações'>
                            <IconButton
                                className={styles.ask}
                                onClick={onClickAsk}
                                aria-label='Pedir mais informações'
                            >
                                <MI.Autorenew />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title='Rejeitar projeto'>
                            <IconButton
                                className={styles.reject}
                                onClick={onClickReject}
                                aria-label='Rejeitar projeto'
                            >
                                <MI.Block />
                            </IconButton>
                        </Tooltip>
                    </>
                );
            },
        },
    ];

    async function handleApprove(id: number) {
        const personId = user.id;

        const requestData = {
            personId,
        };

        try {
            await api.put(`acceptProject/${id}`, requestData);
            toast.success('Projeto aprovado');
            reload();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    async function handleAsk(id: number) {
        const personId = user.id;

        const requestData = {
            personId,
        };

        try {
            await api.put(`askForProjectInformation/${id}`, requestData);
            toast.success('Projeto atualizado para pedir mais informações');
            reload();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    async function handleReject(id: number) {
        const personId = user.id;

        const requestData = {
            personId,
        };

        try {
            await api.put(`rejectProject/${id}`, requestData);
            toast.success('Projeto Rejeitado');
            reload();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    async function reload() {
        try {
            const { data: portfolioData } = await api.get(
                `/portfolios/${user.idOrganization}`
            );
            const portfolioId = portfolioData.id_portfolio;
            const { data } = await api.get(`/evaluatedProjects/${portfolioId}`);

            if (data.length < 1) {
                setProjects([]);
                toast.error('Todos os projetos foram avaliados');
                return;
            }

            const projects = data.map((project) => {
                return {
                    id: project.id_project,
                    idPortfolio: project.id_portfolio,
                    name: project.name,
                    description: project.description,
                    grade: project.grade,
                    plannedStartDateAsString: format(
                        new Date(project.planned_start_date),
                        'dd/MM/yyyy',
                        {
                            locale: ptBR,
                        }
                    ),
                    plannedEndDateAsString: format(
                        new Date(project.planned_end_date),
                        'dd/MM/yyyy',
                        {
                            locale: ptBR,
                        }
                    ),
                };
            });
            setProjects(projects);
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className={styles.listProjects}>
            <div className={styles.dataTableContainer}>
                <DataGrid
                    disableColumnSelector={true}
                    disableSelectionOnClick={true}
                    rows={projectList}
                    columns={columns}
                    pageSize={15}
                />
            </div>
        </div>
    );
}
