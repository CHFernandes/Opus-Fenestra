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

type RunningProject = {
    id: number;
    name: string;
    description: string;
    completion: number;
    responsible: string;
    plannedStartDateAsString: string;
    plannedEndDateAsString: string;
    actualStartDateAsString: string;
}

export default function RunningProjects(): JSX.Element  {
    const { isAuthenticated, user } = useContext(AuthContext);
    const [project, setProjects] = useState<RunningProject[]>([]);

    useEffect(() => {
        async function getProjects() {
            try {
                const { data:portfolioData } = await api.get(`/portfolios/${user.idOrganization}`);
                const portfolioId = portfolioData.id_portfolio;
                const { data } = await api.get(`/runningProjects/${portfolioId}`);

                if (data.length < 1) {
                    setProjects([]);
                    toast.error('Nenhum projeto está em execução');
                    return;
                }

                const projects = data.map((project) => {
                    return {
                        id: project.id_project,
                        name: project.name,
                        description: project.description,
                        completion: project.completion,
                        responsible: project.responsible,
                        plannedStartDateAsString: format(new Date(project.planned_start_date), 'dd/MM/yyyy', {
                            locale: ptBR,
                        }),
                        plannedEndDateAsString: format(new Date(project.planned_end_date), 'dd/MM/yyyy', {
                            locale: ptBR,
                        }),
                        actualStartDateAsString: format(new Date(project.actual_start_date), 'dd/MM/yyyy', {
                            locale: ptBR,
                        })
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
            field: 'completion',
            headerName: 'Completude',
            flex: 1.25,
            renderCell: function getCell (params) {
                return(
                    <>
                        {params.row.completion ? (
                            <span>{`${params.row.completion}%`}</span>
                        ): (
                            <span>0%</span>
                        )}
                    </>
                );
            }
        },
        {
            field: 'responsible',
            headerName: 'Responsável',
            flex: 1.8,
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
            field: 'actualStartDateAsString',
            headerName: 'Data de início real',
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
            renderCell: function getCell (params) {
                const onClickEdit = () => {
                    return handleEdit(params.row.id);
                };
        
                return (
                    <>
                        <Tooltip title='Editar Projeto'>
                            <IconButton onClick={onClickEdit} aria-label='Editar Projeto' >
                                <MI.Edit />
                            </IconButton>
                        </Tooltip>
                    </>
                );
            }
        },
    ];

    function handleEdit (id: number) {
        const idCriteria = String(id);
        router.push(`/RegisterProjects/${idCriteria}`);
    }

    return (
        <div className={styles.listProjects}>
            <div className={styles.dataTableContainer} >
                <DataGrid disableColumnSelector={true} disableSelectionOnClick={true} rows={projectList} columns={columns} pageSize={15} />
            </div>
        </div>
    );
}