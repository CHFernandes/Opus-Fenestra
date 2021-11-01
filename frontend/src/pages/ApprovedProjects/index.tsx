import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import {
    Button,
    Dialog,
    DialogTitle,
    IconButton,
    TextField,
    Tooltip,
} from '@material-ui/core';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { Autocomplete } from '@material-ui/lab';
import * as MI from '@material-ui/icons';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { api } from '../../services/api';
import styles from './styles.module.scss';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

type ApprovedProject = {
    id: number;
    name: string;
    description: string;
    plannedStartDateAsString: string;
    plannedEndDateAsString: string;
};

type Person = {
    personId: number;
    name: string;
};

export default function ApprovedProjects(): JSX.Element {
    const { isAuthenticated, user } = useContext(AuthContext);
    const [project, setProjects] = useState<ApprovedProject[]>([]);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [persons, setPersons] = useState<Person[]>([]);
    const [responsible, setResponsible] = useState<Person | null>(null);
    const [currentProjectId, setCurrentProjectId] = useState<number | null>(
        null
    );

    useEffect(() => {
        async function getProjects() {
            try {
                const { data: portfolioData } = await api.get(
                    `/portfolios/${user.idOrganization}`
                );
                const portfolioId = portfolioData.id_portfolio;
                const { data } = await api.get(
                    `/approvedProjects/${portfolioId}`
                );

                if (data.length < 1) {
                    setProjects([]);
                    toast.error('Nenhum projeto aprovado está pendente');
                    return;
                }

                const projects = data.map((project) => {
                    return {
                        id: project.id_project,
                        name: project.name,
                        description: project.description,
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

        async function getPersons() {
            try {
                const { data } = await api.get(
                    `/personsOrganization/${user.idOrganization}`
                );

                if (data.length < 1) {
                    toast.error('Nenhuma pessoa está cadastrada');
                    setPersons([]);
                    return;
                }

                const personData = data.map((person) => {
                    return {
                        personId: person.id_person,
                        name: person.name,
                    };
                });

                setPersons(personData);
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }

        if (!isAuthenticated) {
            router.push('/Login');
            return;
        }

        getProjects();
        getPersons();
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
            field: '',
            headerName: '',
            sortable: false,
            headerAlign: 'center',
            align: 'center',
            flex: 1.25,
            disableClickEventBubbling: true,
            renderCell: function getCell(params) {
                const onClickStart = () => {
                    return handleClickOpen(params.row.id);
                };

                return (
                    <>
                        <Tooltip title='Aprovar Projeto'>
                            <IconButton
                                className={styles.approve}
                                onClick={onClickStart}
                                aria-label='Aprovar Projeto'
                            >
                                <MI.Check />
                            </IconButton>
                        </Tooltip>
                    </>
                );
            },
        },
    ];

    async function reload() {
        try {
            const { data: portfolioData } = await api.get(
                `/portfolios/${user.idOrganization}`
            );
            const portfolioId = portfolioData.id_portfolio;
            const { data } = await api.get(`/approvedProjects/${portfolioId}`);

            if (data.length < 1) {
                setProjects([]);
                toast.error('Nenhum projeto aprovado está pendente');
                return;
            }

            const projects = data.map((project) => {
                return {
                    id: project.id_project,
                    name: project.name,
                    description: project.description,
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

    function handleClickOpen(id: number) {
        setCurrentProjectId(id);
        setOpenDialog(true);
    }

    function handleClose() {
        setOpenDialog(false);
    }

    async function handleStart() {
        try {
            if (!responsible) {
                toast.error('Selecione um responsável pelo projeto');
                return;
            }
            const responsibleId = responsible.personId;
            const personId = user.id;

            const requestData = {
                responsibleId,
                personId,
            };

            const id = currentProjectId;
            await api.put(`beginProject/${id}`, requestData);
            handleClose();
            toast.success('Projeto iniciado');
            reload();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <>
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
            <Dialog
                className={styles.dialog}
                onClose={handleClose}
                aria-labelledby='selecao-responsavel'
                open={openDialog}
            >
                <DialogTitle id='selecao-responsavel'>
                    Selecionar responsável pelo projeto
                </DialogTitle>
                <div className={styles.field}>
                    <Autocomplete
                        id='combo-box-responsavel'
                        options={persons}
                        getOptionLabel={(option) => option.name}
                        style={{ width: 300 }}
                        onChange={(event, newValue: Person | null) => {
                            setResponsible(newValue);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label='Responsável'
                                variant='outlined'
                            />
                        )}
                    />
                </div>
                <div className={styles.buttonWrapper}>
                    <Button
                        variant='contained'
                        color='primary'
                        size='large'
                        onClick={handleStart}
                    >
                        Iniciar Projeto
                    </Button>
                </div>
            </Dialog>
        </>
    );
}
