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

type FinishedProject = {
    id: number;
    name: string;
    responsible: string;
    plannedStartDateAsString: string;
    plannedEndDateAsString: string;
    actualStartDateAsString: string;
    actualEndDateAsString: string;
};

export default function FinishedProjects(): JSX.Element {
    const { isAuthenticated, user } = useContext(AuthContext);
    const [project, setProjects] = useState<FinishedProject[]>([]);

    useEffect(() => {
        async function getProjects() {
            try {
                const { data: portfolioData } = await api.get(
                    `/portfolios/${user.idOrganization}`
                );
                const portfolioId = portfolioData.id_portfolio;
                const { data } = await api.get(
                    `/finishedProjects/${portfolioId}`
                );

                if (data.length < 1) {
                    setProjects([]);
                    toast.error('Nenhum projeto foi finalizado');
                    return;
                }

                const projects = data.map((project) => {
                    return {
                        id: project.id_project,
                        name: project.name,
                        responsible: project.responsible,
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
                        actualStartDateAsString: format(
                            new Date(project.actual_start_date),
                            'dd/MM/yyyy',
                            {
                                locale: ptBR,
                            }
                        ),
                        actualEndDateAsString: format(
                            new Date(project.actual_end_date),
                            'dd/MM/yyyy',
                            {
                                locale: ptBR,
                            }
                        ),
                    };
                });

                setProjects(projects);
            } catch (error) {
                if (error.response) {
                    toast.error(error.response.data.message);
                }
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
            field: 'responsible',
            headerName: 'Responsável',
            flex: 1.5,
        },
        {
            field: 'plannedStartDateAsString',
            headerName: 'Data de inicio planejada',
            flex: 1.8,
        },
        {
            field: 'actualStartDateAsString',
            headerName: 'Data de inicio real',
            flex: 1.8,
        },
        {
            field: 'plannedEndDateAsString',
            headerName: 'Data de fim planejada',
            flex: 1.8,
        },
        {
            field: 'actualEndDateAsString',
            headerName: 'Data de fim real',
            flex: 1.8,
        },
        {
            field: '',
            headerName: '',
            sortable: false,
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            disableClickEventBubbling: true,
            renderCell: function getCell(params) {
                const onClickEdit = () => {
                    return handleEdit(params.row.id);
                };

                return (
                    <>
                        <Tooltip title='Abrir Projeto'>
                            <IconButton
                                onClick={onClickEdit}
                                aria-label='Abrir Projeto'
                            >
                                <MI.Visibility />
                            </IconButton>
                        </Tooltip>
                    </>
                );
            },
        },
    ];

    function handleEdit(id: number) {
        const idCriteria = String(id);
        router.push(`/RegisterProjects/${idCriteria}`);
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
