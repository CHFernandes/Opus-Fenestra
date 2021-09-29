import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import { IconButton, Tooltip } from '@material-ui/core';
import { DataGrid, GridColDef} from '@material-ui/data-grid';
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
}

export default function AcceptProjects(): JSX.Element  {
    const { isAuthenticated, user } = useContext(AuthContext);
    const [project, setProjects] = useState<EvaluatedProject[]>([]);

    useEffect(() => {
        async function getProjects() {
            try {
                const { data:portfolioData } = await api.get(`/portfolios/${user.idOrganization}`);
                const portfolioId = portfolioData.id_portfolio;
                const { data } = await api.get(`/evaluatedProjects/${portfolioId}`);
                const projects = data.map((project) => {
                    return {
                        id: project.id_project,
                        idPortfolio: project.id_portfolio,
                        name: project.name,
                        description: project.description,
                        grade: project.grade,
                        plannedStartDateAsString: format(new Date(project.planned_start_date), 'dd/MM/yyyy', {
                            locale: ptBR,
                        }),
                        plannedEndDateAsString: format(new Date(project.planned_end_date), 'dd/MM/yyyy', {
                            locale: ptBR,
                        }),

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
            renderCell: function getCell (params) {
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
            }
        },
    ];

    function handleApprove(id: number) {
        alert(`Aprovando ${id}`);
    }

    async function handleAsk(id: number) {
        try {
            await api.put(`askForProjectInformation/${id}`);
            toast.success('Projeto atualizado para pedir mais informações');
            reload();
        } catch (error) {
            toast.error(error.response.data.message);
        }
        
    }

    function handleReject (id: number) {
        alert(`Rejeitando ${id}`);
    }

    async function reload() {
        try {
            const { data:portfolioData } = await api.get(`/portfolios/${user.idOrganization}`);
            const portfolioId = portfolioData.id_portfolio;
            const { data } = await api.get(`/evaluatedProjects/${portfolioId}`);
            const projects = data.map((project) => {
                return {
                    id: project.id_project,
                    idPortfolio: project.id_portfolio,
                    name: project.name,
                    description: project.description,
                    grade: project.grade,
                    plannedStartDateAsString: format(new Date(project.planned_start_date), 'dd/MM/yyyy', {
                        locale: ptBR,
                    }),
                    plannedEndDateAsString: format(new Date(project.planned_end_date), 'dd/MM/yyyy', {
                        locale: ptBR,
                    }),

                };
            });
            setProjects(projects);
        } catch (error) {
            toast.error(error.response.data.message);
            const errorMessage = error.response.data.message;
            if (errorMessage === 'Todos os projetos foram avaliados') {
                setProjects([]);
            }
        }
    }

    return (
        <div className={styles.listProjects}>
            <div className={styles.dataTableContainer} >
                <DataGrid disableColumnSelector={true} disableSelectionOnClick={true} rows={projectList} columns={columns} pageSize={15} />
            </div>
        </div>
    );
}