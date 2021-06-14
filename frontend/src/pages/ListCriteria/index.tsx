import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'

import { Button, IconButton } from '@material-ui/core';
import { DataGrid, GridColDef} from "@material-ui/data-grid";

import * as MI from '@material-ui/icons';

import { api } from '../../services/api';
import styles from './styles.module.scss';


type Criterion = {
    id: number;
    idCriteria ?: number;
    description: string;
    weight: number;
    unityType: string;
    bestValue: number;
    worstValue: number;
}


export default function ListCriteria() {
    const [criteria, setCriteria] = useState<Criterion[]>([]);

    useEffect(() => {
        async function getCriteria() {
            const { data } = await api.get('criteria');

            const criteria = data.map((criterion: Criterion) => {
                return {
                    id: criterion.idCriteria,
                    description: criterion.description,
                    weight: criterion.weight,
                    unityType: criterion.unityType,
                    bestValue: criterion.bestValue,
                    worstValue: criterion.worstValue,
                };
            });

            setCriteria(criteria);
        }
        getCriteria();
    }, []);

    const router = useRouter();

    const criteriaList = criteria;

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            flex: 1,
        },
        {
            field: 'description',
            headerName: 'Descrição',
            flex: 3,
        },
        {
            field: 'weight',
            headerName: 'Peso',
            flex: 1.5,
        },
        {
            field: 'unityType',
            headerName: 'Tipo da unidade',
            flex: 2,
        },
        {
            field: 'bestValue',
            headerName: 'Valor mais esperado',
            flex: 2,
        },
        {
            field: 'worstValue',
            headerName: 'Valor menos esperado',
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
            renderCell: (params) => {
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
        router.push('/RegisterCriteria/-1');
    }

    function handleEdit (id: number) {
        const idCriteria = String(id);
        router.push(`/RegisterCriteria/${idCriteria}`);
    }

    async function handleDelete (id: number) {
        const idCriteria = String(id);
        const { data }  = await api.delete(`/criteria/${idCriteria}`);
        if (data) {
            const criteria = data.map((criterion: Criterion) => {
                return {
                    id: criterion.idCriteria,
                    description: criterion.description,
                    weight: criterion.weight,
                    unityType: criterion.unityType,
                    bestValue: criterion.bestValue,
                    worstValue: criterion.worstValue,
                };
            });
            setCriteria(criteria);
            alert('Critério Excluído');
        }

    }

    return (
        <div className={styles.listCriteria}>
            <div className={styles.buttonHeadbar}>
                <Button
                    variant='contained'
                    color='primary'
                    size='large'
                    onClick={handleNewCriteria}
                >
                    Adicionar novo critério
                </Button>
            </div>
            <div className={styles.dataTableContainer} >
                <DataGrid disableColumnSelector={true} disableSelectionOnClick={true} rows={criteriaList} columns={columns} pageSize={15} />
            </div>
        </div>
    );
}