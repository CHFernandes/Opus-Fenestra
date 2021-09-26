import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import { Button, IconButton } from '@material-ui/core';
import { DataGrid, GridColDef} from '@material-ui/data-grid';
import * as MI from '@material-ui/icons';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { api } from '../../services/api';
import styles from './styles.module.scss';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

type Project = {
    id: number;
    idProject: number;
    idPortfolio: number;
    name: string;
    description: string;
    plannedStartDateAsString: string;
    plannedEndDateAsString: string;
}


export default function ListProjects(): JSX.Element  {
    const { isAuthenticated, user } = useContext(AuthContext);
    const [project, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        async function getProjects() {
            try {
                const { data:portfolioData } = await api.get(`/portfolios/${user.idOrganization}`);
                const portfolioId = portfolioData.id_portfolio;
                const { data } = await api.get(`/registeredProjects/${portfolioId}`);
                const projects = data.map((project) => {
                    return {
                        id: project.id_project,
                        idPortfolio: project.id_portfolio,
                        name: project.name,
                        description: project.description,
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
            renderCell: function getCell (params) {
                const onClickEvaluate = () => {
                    return handleEvaluateOne(params.row.id);
                };
        
                return (
                    <>
                        <IconButton onClick={onClickEvaluate} aria-label='Avaliar este projeto' >
                            <MI.ListAlt />
                        </IconButton>
                    </>
                );
            }
          },
      ];

    function handleEvaluateAll () {
        router.push('/EvaluateProjects/-1');
    }

    function handleEvaluateOne (id: number) {
        const idCriteria = String(id);
        router.push(`/EvaluateProjects/${idCriteria}`);
    }

    return (
        <div className={styles.listProjects}>
            <div className={styles.buttonHeadbar}>
                <Button
                    variant='contained'
                    color='primary'
                    size='large'
                    onClick={handleEvaluateAll}
                >
                    Avaliar todos os projetos
                </Button>
            </div>
            <div className={styles.dataTableContainer} >
                <DataGrid disableColumnSelector={true} disableSelectionOnClick={true} rows={projectList} columns={columns} pageSize={15} />
            </div>
        </div>
    );
}