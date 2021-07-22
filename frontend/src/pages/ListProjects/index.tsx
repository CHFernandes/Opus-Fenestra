import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Button, IconButton } from '@material-ui/core';
import { DataGrid, GridColDef} from '@material-ui/data-grid';
import * as MI from '@material-ui/icons';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { DeleteConfirmation } from '../../components/DeleteConfirmation';

import { api } from '../../services/api';
import styles from './styles.module.scss';

type Project = {
    id: number;
    idProject: number;
    name: string;
    description: string;
    completion: number;
    plannedStartDate: string;
    plannedEndDate: string;
}


export default function ListProjects(): JSX.Element  {
    const [project, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        async function getProjects() {
            const { data } = await api.get('projects');

            const projects = data.map((project: Project) => {
                return {
                    id: project.idProject,
                    name: project.name,
                    description: project.description,
                    completion: Number(project.completion),
                    plannedStartDate: format(new Date(project.plannedStartDate), 'dd/MM/yyyy', {
                        locale: ptBR,
                    }),
                    plannedEndDate: format(new Date(project.plannedEndDate), 'dd/MM/yyyy', {
                        locale: ptBR,
                    }),
                };
            });

            setProjects(projects);
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
            flex: 3,
        },
        {
            field: 'completion',
            headerName: 'Completude',
            flex: 1.5,
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
            field: 'plannedStartDate',
            headerName: 'Data de inicio planejada',
            flex: 2.5,
        },
        {
            field: 'plannedEndDate',
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
              const onClickEdit = () => {
                return handleEdit(params.row.id);
              };

              const onClickDelete = () => {
                return handleDelete(params.row.id);
              };
        
                return (
                    <>
                        <IconButton onClick={onClickEdit} aria-label='Editar Critério' >
                            <MI.Edit />
                        </IconButton>
                        <IconButton onClick={onClickDelete} aria-label='Excluir Critério' >
                            <MI.Delete />
                        </IconButton>
                    </>
                );
            }
          },
      ];

    function handleNewCriteria () {
        router.push('/RegisterProjects/-1');
    }

    function handleEdit (id: number) {
        const idCriteria = String(id);
        router.push(`/RegisterProjects/${idCriteria}`);
    }

    async function handleDelete (id: number) {

        const response = await DeleteConfirmation();

        if(!response){
            return;
        }

        const idCriteria = String(id);
        const { data }  = await api.delete(`/projects/${idCriteria}`);
        if (data) {
            const projects = data.map((project: Project) => {
                return {
                    id: project.idProject,
                    name: project.name,
                    description: project.description,
                    completion: Number(project.completion),
                    plannedStartDate: format(new Date(project.plannedStartDate), 'dd/MM/yyyy', {
                        locale: ptBR,
                    }),
                    plannedEndDate: format(new Date(project.plannedEndDate), 'dd/MM/yyyy', {
                        locale: ptBR,
                    }),
                };
            });
            setProjects(projects);
            alert('Projeto Excluído');
        }
    }

    return (
        <div className={styles.listProjects}>
            <div className={styles.buttonHeadbar}>
                <Button
                    variant='contained'
                    color='primary'
                    size='large'
                    onClick={handleNewCriteria}
                >
                    Adicionar novo Projeto
                </Button>
            </div>
            <div className={styles.dataTableContainer} >
                <DataGrid disableColumnSelector={true} disableSelectionOnClick={true} rows={projectList} columns={columns} pageSize={15} />
            </div>
        </div>
    );
}