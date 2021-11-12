import React, { useState, useEffect, useContext } from 'react';

import {
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography,
} from '@material-ui/core';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { AuthContext } from '../../contexts/AuthContext';

import styles from './styles.module.scss';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

type Evaluation = {
    projectId: number;
    portfolioId: number;
    name: string;
    grade: string;
    evaluationDate: string;
};

export default function LastEvaluations(): JSX.Element {
    const { user } = useContext(AuthContext);
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

    useEffect(() => {
        async function getEvaluations() {
            try {
                const { data: portfolioData } = await api.get(
                    `/portfolios/${user.idOrganization}`
                );

                const portfolioId = portfolioData.id_portfolio;

                const { data } = await api.get(
                    `/showLastEvaluations/${portfolioId}`
                );

                if (data.length < 1) {
                    toast.error('Nenhum projeto foi avaliado');
                    setEvaluations([]);
                    return;
                }

                const evaluations = data.map((evaluation) => {
                    return {
                        projectId: evaluation.id_project,
                        portfolioId: evaluation.id_portfolio,
                        name: evaluation.name,
                        grade: `${Number(evaluation.grade).toFixed(2)}`.replace(
                            '.',
                            ','
                        ),
                        evaluationDate: format(
                            new Date(evaluation.evaluation_date),
                            'dd/MM/yyyy',
                            {
                                locale: ptBR,
                            }
                        ),
                    };
                });

                setEvaluations(evaluations);
            } catch (error) {
                toast.error(error.response?.data.message);
            }
        }

        getEvaluations();
    }, []);

    return (
        <>
            <Card className={styles.cardRoot}>
                <CardContent>
                    <div className={styles.contentWrapper}>
                        <div className={styles.headerWrapper}>
                            <Typography className={styles.title} component='h1'>
                                Últimas avaliações
                            </Typography>
                        </div>
                        <TableContainer>
                            <Table size='small'>
                                <TableBody>
                                    {evaluations.map((evaluation, index) => {
                                        return (
                                            <TableRow key={index}>
                                                <TableCell align='left'>
                                                    {evaluation.name}
                                                </TableCell>
                                                <TableCell align='right'>
                                                    Avaliado em -{' '}
                                                    {evaluation.evaluationDate}
                                                </TableCell>
                                                <TableCell align='right'>
                                                    Nota final -{' '}
                                                    {evaluation.grade}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
