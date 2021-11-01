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

type Unit = {
    id: number;
    description: string;
    isManual: boolean;
    isManualString: string;
    bestValue: string;
    worstValue: string;
};

export default function ListCriteria(): JSX.Element {
    const { isAuthenticated } = useContext(AuthContext);
    const [unities, setUnities] = useState<Unit[]>([]);

    useEffect(() => {
        async function getUnities() {
            try {
                const { data } = await api.get('unitiesList');

                if (data.length < 1) {
                    toast.error('Nenhuma unidade está cadastrada');
                    setUnities([]);
                    return;
                }

                const unitArray = data.map((unit) => {
                    return {
                        id: unit.id_unities,
                        description: unit.description,
                        isManual:
                            Number(unit.is_values_manual) === 1 ? true : false,
                        isManualString:
                            Number(unit.is_values_manual) === 1
                                ? 'Manual'
                                : 'Customizado',
                        bestValue: `${unit.best_value}`,
                        worstValue: `${unit.worst_value}`,
                    };
                });

                setUnities(unitArray);
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }

        if (!isAuthenticated) {
            router.push('/Login');
            return;
        }

        getUnities();
    }, []);

    const router = useRouter();

    const unitList = unities;

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            flex: 1,
        },
        {
            field: 'description',
            headerName: 'Descrição',
            flex: 2,
        },
        {
            field: 'isManualString',
            headerName: 'Manual ou customizado?',
            flex: 1.5,
        },
        {
            field: 'bestValue',
            headerName: 'Valor máximo',
            flex: 1.5,
        },
        {
            field: 'worstValue',
            headerName: 'Valor mínimo',
            flex: 1.5,
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
                            aria-label='Editar Unidade'
                        >
                            <MI.Edit />
                        </IconButton>
                        <IconButton
                            onClick={onClickDelete}
                            aria-label='Excluir Unidade'
                        >
                            <MI.Delete />
                        </IconButton>
                    </>
                );
            },
        },
    ];

    function handleNewCriteria() {
        router.push('/RegisterUnities/-1');
    }

    function handleEdit(id: number) {
        const idCriteria = String(id);
        router.push(`/RegisterUnities/${idCriteria}`);
    }

    async function handleDelete(id: number) {
        try {
            const response = await DeleteConfirmation();

            if (!response) {
                return;
            }

            const idUnit = String(id);
            const responseDeletion = await api.delete(`/unit/${idUnit}`);

            if (!responseDeletion.data) {
                toast.error('Erro durante a exclusão');
                return;
            }

            toast.success('Unidade Excluída');

            const { data } = await api.get('unitiesList');

            if (data.length < 1) {
                toast.error('Nenhuma unidade está cadastrada');
                setUnities([]);
                return;
            }

            if (data) {
                const unitArray = data.map((unit) => {
                    return {
                        id: unit.id_unities,
                        description: unit.description,
                        isManual: unit.is_values_manual === 1 ? true : false,
                        isManualString:
                            unit.is_values_manual === 1
                                ? 'Manual'
                                : 'Customizado',
                        bestValue: `${unit.best_value}`,
                        worstValue: `${unit.worst_value}`,
                    };
                });

                setUnities(unitArray);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className={styles.listUnities}>
            <div className={styles.buttonHeadbar}>
                <Button
                    variant='contained'
                    color='primary'
                    size='large'
                    onClick={handleNewCriteria}
                >
                    Adicionar nova unidade
                </Button>
            </div>
            <div className={styles.dataTableContainer}>
                <DataGrid
                    disableColumnSelector={true}
                    disableSelectionOnClick={true}
                    rows={unitList}
                    columns={columns}
                    pageSize={15}
                />
            </div>
        </div>
    );
}
