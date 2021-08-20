import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Button, IconButton } from '@material-ui/core';
import { DataGrid, GridColDef} from '@material-ui/data-grid';

import * as MI from '@material-ui/icons';

import { DeleteConfirmation } from '../../components/DeleteConfirmation';

import { api } from '../../services/api';
import styles from './styles.module.scss';

type Person = {
    id: number;
    name: string;
    user: string;
    email: string;
    persona: string;
}

export default function ListPersons(): JSX.Element {
    const [personList, setPersons] = useState<Person[]>([]);

    useEffect(() => {
        async function getPersons() {
            // const { data } = await api.get('criteria');

            // const persons = data.map((person => {
            //     return {
            //         id: person.idPerson,
            //         name: person.name,
            //         user: person.user,
            //         email: person.email,
            //         persona: person.personaDescription,
            //     };
            // }));

            const persons = [
                {
                    id: 69,
                    name: 'Test Testonious',
                    user: 'testonious.telonious',
                    email: 'someEmail@go.to.die',
                    persona: 'Administrador',
                }
            ];

            setPersons(persons);
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
            renderCell: function getCell (params) {
              const onClickEdit = () => {
                return handleEdit(params.row.id);
              };

              const onClickDelete = () => {
                return handleDelete(params.row.id);
              };
        
                return (
                    <>
                        <IconButton onClick={onClickEdit} aria-label='Editar Usuário' >
                            <MI.Edit />
                        </IconButton>
                        <IconButton onClick={onClickDelete} aria-label='Excluir Usuário' >
                            <MI.Delete />
                        </IconButton>
                    </>
                );
            }
        },
    ];

    function handleNewPerson () {
        router.push('/RegisterPerson/-1');
    }

    function handleEdit (id: number) {
        const idCriteria = String(id);
        router.push(`/RegisterPerson/${idCriteria}`);
    }

    async function handleDelete (id: number) {

        const response = await DeleteConfirmation();

        if(!response){
            return;
        }

        const idCriteria = String(id);
        const responseDeletion = await api.delete(`/persons/${idCriteria}`);

        if (!responseDeletion.data) {
            alert('Erro durante a exclusão');
            return;
        }

        alert('Critério Excluído');

        const { data } = await api.get('persons');

        if (data) {
            const persons = data.map((person) => {
                return {
                    id: person.idPerson,
                    name: person.name,
                    user: person.user,
                    email: person.email,
                    persona: person.personaDescription,
                };
            });
            setPersons(persons);
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
            <div className={styles.dataTableContainer} >
                <DataGrid disableColumnSelector={true} disableSelectionOnClick={true} rows={personList} columns={columns} pageSize={15} />
            </div>
        </div>
    );
}