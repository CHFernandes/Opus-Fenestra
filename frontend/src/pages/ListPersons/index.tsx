import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import { Button, IconButton } from '@material-ui/core';
import { DataGrid, GridColDef } from '@material-ui/data-grid';

import * as MI from '@material-ui/icons';

import { DeleteConfirmation } from '../../components/DeleteConfirmation';

import { api } from '../../services/api';
import styles from './styles.module.scss';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

type Person = {
    id: number;
    name: string;
    user: string;
    email: string;
    persona: string;
};

export default function ListPersons(): JSX.Element {
    const { isAuthenticated, user } = useContext(AuthContext);
    const [personList, setPersons] = useState<Person[]>([]);

    useEffect(() => {
        async function getPersons() {
            try {
                const { idOrganization } = user;

                const { data } = await api.get(
                    `personsOrganization/${idOrganization}`
                );

                if (data.length < 1) {
                    toast.error('Nenhuma pessoa está cadastrada');
                    setPersons([]);
                    return;
                }

                const persons = data.map((person) => {
                    return {
                        id: person.id_person,
                        name: person.name,
                        user: person.user,
                        email: person.email,
                        persona: person.type_persona,
                    };
                });

                setPersons(persons);
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }

        if (!isAuthenticated) {
            router.push('/Login');
            return;
        }

        getPersons();
    }, []);

    const router = useRouter();

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            flex: 1,
        },
        {
            field: 'name',
            headerName: 'Nome Completo',
            flex: 3,
        },
        {
            field: 'user',
            headerName: 'Nome de usuário',
            flex: 1.5,
        },
        {
            field: 'email',
            headerName: 'E-mail',
            flex: 2,
        },
        {
            field: 'persona',
            headerName: 'Tipo de usuário',
            flex: 2,
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
                            aria-label='Editar Usuário'
                        >
                            <MI.Edit />
                        </IconButton>
                        <IconButton
                            onClick={onClickDelete}
                            aria-label='Excluir Usuário'
                        >
                            <MI.Delete />
                        </IconButton>
                    </>
                );
            },
        },
    ];

    function handleNewPerson() {
        router.push('/RegisterPersons/-1');
    }

    function handleEdit(id: number) {
        const idPerson = String(id);
        router.push(`/RegisterPersons/${idPerson}`);
    }

    async function handleDelete(id: number) {
        try {
            const response = await DeleteConfirmation();

            if (!response) {
                return;
            }

            const idPerson = String(id);
            const responseDeletion = await api.delete(`/persons/${idPerson}`);

            if (!responseDeletion.data) {
                toast.error('Erro durante a exclusão');
                return;
            }

            toast.success('Pessoa Excluída');

            const { idOrganization } = user;
            const { data } = await api.get(
                `personsOrganization/${idOrganization}`
            );

            if (data.length < 1) {
                toast.error('Nenhuma pessoa está cadastrada');
                setPersons([]);
                return;
            }

            if (data) {
                const persons = data.map((person) => {
                    return {
                        id: person.id_person,
                        name: person.name,
                        user: person.user,
                        email: person.email,
                        persona: person.type_persona,
                    };
                });

                setPersons(persons);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className={styles.listPersons}>
            <div className={styles.buttonHeadbar}>
                <Button
                    variant='contained'
                    color='primary'
                    size='large'
                    onClick={handleNewPerson}
                >
                    Adicionar novo usuário
                </Button>
            </div>
            <div className={styles.dataTableContainer}>
                <DataGrid
                    disableColumnSelector={true}
                    disableSelectionOnClick={true}
                    rows={personList}
                    columns={columns}
                    pageSize={15}
                />
            </div>
        </div>
    );
}
