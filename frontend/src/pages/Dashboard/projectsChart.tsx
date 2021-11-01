import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import {
    Card,
    CardContent,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Tooltip,
    Typography,
} from '@material-ui/core';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { AuthContext } from '../../contexts/AuthContext';
import * as MI from '@material-ui/icons/';

import styles from './styles.module.scss';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { Doughnut } from 'react-chartjs-2';

type Dataset = {
    label: string;
    data: number[];
    backgroundColor: string[];
};

type ChartData = {
    labels: string[];
    datasets: Dataset[];
};

export default function ProjectsChart(): JSX.Element {
    const { user } = useContext(AuthContext);
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'left',
            },
        },
    };
    const labelArray = [
        'Cadastrado',
        'Avaliado',
        'Aprovado',
        'Em Execução',
        'Finalizado',
        'Necessita de mais informações',
        'Rejeitado',
        'Paralisado',
        'Cancelado',
    ];
    const dataArray = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const backgroundColorArray = [
        '#06fbe7',
        '#fffb00',
        '#26ff00',
        '#00aeff',
        '#000c50',
        '#ff9100',
        '#ff00ea',
        '#ff0000',
        '#270000',
    ];
    const defaultChartDataSet = {
        label: 'Projetos por quantidade',
        data: dataArray,
        backgroundColor: backgroundColorArray,
    };
    const defaultChartData = {
        labels: labelArray,
        datasets: [defaultChartDataSet],
    };

    const [projectStatus, setProjectStatus] =
        useState<ChartData>(defaultChartData);

    useEffect(() => {
        async function getProjectsStatusQuantity() {
            try {
                const { data: portfolioData } = await api.get(
                    `/portfolios/${user.idOrganization}`
                );
                const portfolioId = portfolioData.id_portfolio;

                const { data } = await api.get(
                    `/getProjectsStatusQuantity/${portfolioId}`
                );

                if (data.length < 1) {
                    setProjectStatus(null);
                    toast.error('Nenhum projeto está cadastrado');
                    return;
                }

                const statusQuantities = data.map((statusQuantity) => {
                    return {
                        statusId: statusQuantity.id_status,
                        quantity: statusQuantity.quantity,
                        description: statusQuantity.status,
                    };
                });

                const dataArrayQuantity = [0, 0, 0, 0, 0, 0, 0, 0, 0];

                statusQuantities.forEach((statusQuantity) => {
                    const statusId = Number(statusQuantity.statusId);
                    dataArrayQuantity[statusId - 1] = Number(
                        statusQuantity.quantity
                    );
                });

                console.log(dataArrayQuantity);

                const dataSet: Dataset = {
                    label: 'Projetos por quantidade',
                    data: dataArrayQuantity,
                    backgroundColor: backgroundColorArray,
                };

                const projectStatusReturn: ChartData = {
                    labels: labelArray,
                    datasets: [dataSet],
                };

                setProjectStatus(projectStatusReturn);
            } catch (error) {
                console.log(error);
                toast.error(error.response?.data.message);
            }
        }

        getProjectsStatusQuantity();
    }, []);

    return (
        <>
            <Card className={styles.cardRoot}>
                <CardContent>
                    <div className={styles.contentWrapper}>
                        <div className={styles.titleWrapper}>
                            <Typography className={styles.title} component='h1'>
                                Projetos por quantidade
                            </Typography>
                        </div>
                    </div>
                    <Doughnut
                        data={projectStatus}
                        width={800}
                        height={800}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'right',
                                    labels: { padding: 10 },
                                },
                            },
                        }}
                    />
                </CardContent>
            </Card>
        </>
    );
}
