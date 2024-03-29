import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import { Button, IconButton } from '@material-ui/core';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import * as MI from '@material-ui/icons';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { DeleteConfirmation } from '../../components/DeleteConfirmation';

import { api } from '../../services/api';
import styles from './styles.module.scss';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

type Project = {
    id: number;
    idProject: number;
    idPortfolio: number;
    status: number;
    statusDescription: string;
    name: string;
    description: string;
    completion: number;
    plannedStartDate: Date;
    plannedEndDate: Date;
    plannedStartDateAsString: string;
    plannedEndDateAsString: string;
};

export default function ListProjects(): JSX.Element {
    const { isAuthenticated, user } = useContext(AuthContext);
    const [project, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        async function getProjects() {
            try {
                const { data: portfolioData } = await api.get(
                    `/portfolios/${user.idOrganization}`
                );
                const portfolioId = portfolioData.id_portfolio;
                const { data } = await api.get(
                    `/projectsPortfolio/${portfolioId}`
                );

                if (data.length < 1) {
                    setProjects([]);
                    toast.error('Nenhum projeto está cadastrado');
                    return;
                }

                const projects = data.map((project) => {
                    return {
                        id: project.id_project,
                        idPortfolio: project.id_portfolio,
                        name: project.name,
                        description: project.description,
                        completion: Number(project.completion),
                        statusDescription: project.status_description,
                        status: project.id_status,
                        plannedStartDate: new Date(project.planned_start_date),
                        plannedEndDate: new Date(project.planned_end_date),
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
            field: 'description',
            headerName: 'Descrição',
            flex: 2.5,
        },
        {
            field: 'statusDescription',
            headerName: 'Status',
            flex: 1.5,
        },
        {
            field: 'completion',
            headerName: 'Completude',
            flex: 1.5,
            renderCell: function getCell(params) {
                return (
                    <>
                        {params.row.completion ? (
                            <span>{`${params.row.completion}%`}</span>
                        ) : (
                            <span>0%</span>
                        )}
                    </>
                );
            },
        },
        {
            field: 'plannedStartDateAsString',
            headerName: 'Data de inicio planejada',
            flex: 2.5,
        },
        {
            field: 'plannedEndDateAsString',
            headerName: 'Data de fim planejada',
            flex: 2.5,
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

                const onClickDelete = () => {
                    return handleDelete(params.row.id);
                };

                return (
                    <>
                        <IconButton
                            onClick={onClickEdit}
                            aria-label='Editar Projeto'
                        >
                            <MI.Edit />
                        </IconButton>
                        <IconButton
                            onClick={onClickDelete}
                            aria-label='Excluir Projeto'
                        >
                            <MI.Delete />
                        </IconButton>
                    </>
                );
            },
        },
    ];

    function handleNewProject() {
        router.push('/RegisterProjects/-1');
    }

    function handleEdit(id: number) {
        const idCriteria = String(id);
        router.push(`/RegisterProjects/${idCriteria}`);
    }

    async function handleDelete(id: number) {
        try {
            const response = await DeleteConfirmation();

            if (!response) {
                return;
            }

            const idProject = String(id);
            const responseDeletion = await api.delete(`/projects/${idProject}`);

            if (!responseDeletion.data) {
                toast.error('Erro durante a exclusão');
                return;
            }

            const { data: portfolioData } = await api.get(
                `/portfolios/${user.idOrganization}`
            );
            const portfolioId = portfolioData.id_portfolio;
            const { data } = await api.get(`/projectsPortfolio/${portfolioId}`);

            if (data.length < 1) {
                setProjects([]);
                toast.success('Projeto Excluído');
                toast.error('Nenhum projeto está cadastrado');
                return;
            }

            if (data) {
                const projects = data.map((project) => {
                    return {
                        id: project.id_project,
                        idPortfolio: project.id_portfolio,
                        name: project.name,
                        description: project.description,
                        completion: Number(project.completion),
                        statusDescription: project.status_description,
                        status: project.id_status,
                        plannedStartDate: new Date(project.planned_start_date),
                        plannedEndDate: new Date(project.planned_end_date),
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

                toast.success('Projeto Excluído');
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            }
        }
    }

    return (
        <div className={styles.listProjects}>
            <div className={styles.buttonHeadbar}>
                <Button
                    variant='contained'
                    color='primary'
                    size='large'
                    onClick={handleNewProject}
                >
                    Adicionar novo Projeto
                </Button>
            </div>
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
