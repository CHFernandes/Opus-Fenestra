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

type Criterion = {
    id: number;
    idCriteria?: number;
    description: string;
    weight: number;
    unityType: string;
    bestValue: string;
    worstValue: string;
};

export default function ListCriteria(): JSX.Element {
    const { isAuthenticated, user } = useContext(AuthContext);
    const [criteria, setCriteria] = useState<Criterion[]>([]);
    const [criteriaSum, setCriteriaSum] = useState<number>(0);

    useEffect(() => {
        async function getCriteria() {
            try {
                const { data: portfolioData } = await api.get(
                    `/portfolios/${user.idOrganization}`
                );
                const portfolioId = portfolioData.id_portfolio;
                const { data } = await api.get(
                    `criteriaPortfolio/${portfolioId}`
                );

                if (data.length < 1) {
                    toast.error('Nenhum critério está cadastrado');
                    setCriteriaSum(0);
                    setCriteria([]);
                    return;
                }

                const criteria = data.map((criterion) => {
                    return {
                        id: criterion.id_criteria,
                        description: criterion.description,
                        weight: criterion.weight,
                        unityType: criterion.unit_description,
                        bestValue: criterion.is_values_manual
                            ? `${criterion.best_value}`
                            : criterion.best_value,
                        worstValue: criterion.is_values_manual
                            ? `${criterion.worst_value}`
                            : criterion.worst_value,
                    };
                });

                const criteriaSum = criteria.reduce((sum, criterion) => {
                    const weightSum = Number(criterion.weight);
                    if (!Number.isNaN(weightSum)) {
                        sum += weightSum;
                    }

                    return sum;
                }, 0);

                setCriteriaSum(criteriaSum);

                setCriteria(criteria);
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
            headerName: 'Valor máximo',
            flex: 2,
        },
        {
            field: 'worstValue',
            headerName: 'Valor mínimo',
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
                            aria-label='Editar Critério'
                        >
                            <MI.Edit />
                        </IconButton>
                        <IconButton
                            onClick={onClickDelete}
                            aria-label='Excluir Critério'
                        >
                            <MI.Delete />
                        </IconButton>
                    </>
                );
            },
        },
    ];

    function handleNewCriteria() {
        router.push('/RegisterCriteria/-1');
    }

    function handleEdit(id: number) {
        const idCriteria = String(id);
        router.push(`/RegisterCriteria/${idCriteria}`);
    }

    async function handleDelete(id: number) {
        try {
            const response = await DeleteConfirmation();

            if (!response) {
                return;
            }

            const idCriteria = String(id);
            const responseDeletion = await api.delete(
                `/criteria/${idCriteria}`
            );

            if (!responseDeletion.data) {
                toast.error('Erro durante a exclusão');
                return;
            }

            toast.success('Critério Excluído');

            const { data: portfolioData } = await api.get(
                `/portfolios/${user.idOrganization}`
            );
            const portfolioId = portfolioData.id_portfolio;
            const { data } = await api.get(`criteriaPortfolio/${portfolioId}`);

            if (data.length < 1) {
                toast.error('Nenhum critério está cadastrado');
                setCriteria([]);
                return;
            }

            if (data) {
                const criteria = data.map((criterion) => {
                    return {
                        id: criterion.id_criteria,
                        description: criterion.description,
                        weight: criterion.weight,
                        unityType: criterion.unit_description,
                        bestValue: criterion.is_values_manual
                            ? `${criterion.best_value}`
                            : criterion.best_value,
                        worstValue: criterion.is_values_manual
                            ? `${criterion.worst_value}`
                            : criterion.worst_value,
                    };
                });
                setCriteria(criteria);
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            }
        }
    }

    return (
        <div className={styles.listCriteria}>
            <div className={styles.buttonHeadbar}>
                <div className={styles.weightInformation}>
                    <h3>
                        Somente será possível realizar avaliações quando a soma
                        dos pesos dos critérios for 10
                    </h3>
                    <p>No momento a soma total dos pesos é: {criteriaSum}</p>
                </div>
                <Button
                    variant='contained'
                    color='primary'
                    size='large'
                    onClick={handleNewCriteria}
                >
                    Adicionar novo critério
                </Button>
            </div>
            <div className={styles.dataTableContainer}>
                <DataGrid
                    disableColumnSelector={true}
                    disableSelectionOnClick={true}
                    rows={criteriaList}
                    columns={columns}
                    pageSize={15}
                />
            </div>
        </div>
    );
}
