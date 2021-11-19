import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import { Button, TextField } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import * as MI from '@material-ui/icons';

import { api } from '../../services/api';
import styles from './styles.module.scss';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

type CriteriaType = {
    id: number;
    label: string;
    value: number;
};

type FormData = {
    id?: number;
    portfolioId?: number;
    description: string;
    weight: number;
    unityType: number;
    bestValue: number;
    worstValue: number;
};

export default function RegisterCriteria(): JSX.Element {
    const { isAuthenticated, user } = useContext(AuthContext);
    const router = useRouter();
    const { slug } = router.query;

    const startingForm = {
        description: '',
        weight: 1,
        unityType: 1,
        bestValue: undefined,
        worstValue: undefined,
    };

    const [formData, setFormData] = useState<FormData>(startingForm);
    const [criteriaTypes, setCriteriaTypes] = useState<CriteriaType[]>([]);
    const { handleSubmit, control, setValue } = useForm<FormData>({
        mode: 'all',
        defaultValues: startingForm,
    });

    useEffect(() => {
        async function getUnities() {
            try {
                const { data } = await api.get('unitiesList');

                if (data.length < 1) {
                    toast.error('Nenhuma unidade está cadastrada');
                    setCriteriaTypes([]);
                    return;
                }

                const unitArray = data.map((unit) => {
                    return {
                        id: Number(unit.id_unities),
                        label: unit.description,
                        value: Number(unit.id_unities),
                    };
                });

                setCriteriaTypes(unitArray);
            } catch (error) {
                if (error.response) {
                    toast.error(error.response.data.message);
                }
            }
        }

        async function getCriterion() {
            try {
                const { data } = await api.get(`/criteria/${slug}`);
                const dataParsed = data;
                const criterion = {
                    id: dataParsed.id_criteria,
                    description: dataParsed.description,
                    weight: dataParsed.weight,
                    unityType: dataParsed.id_unities,
                    bestValue: dataParsed.best_value,
                    worstValue: dataParsed.worst_value,
                    portfolioId: dataParsed.id_portfolio,
                };
                setFormData(criterion);
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

        getUnities();

        if (!isNaN(Number(slug)) && Number(slug) > -1) {
            getCriterion();
        }
    }, []);

    useEffect(() => {
        const { description, weight, unityType } = formData;

        setValue('description', description);
        setValue('weight', weight);
        setValue('unityType', unityType);
    }, [formData]);

    async function onSubmit(data: FormData) {
        const { data: portfolioData } = await api.get(
            `/portfolios/${user.idOrganization}`
        );

        const portfolioId = portfolioData.id_portfolio;

        const { description, weight, unityType } = data;

        const requestData = {
            idPortfolio: Number(portfolioId),
            description: description,
            weight: Number(weight),
            idUnities: Number(unityType),
        };

        try {
            if (Number(slug) > -1) {
                await api.put(`criteria/${slug}`, requestData);

                toast.success('Critério atualizado com sucesso');
                router.push('/ListCriteria');
            } else {
                await api.post('criteria', requestData);

                toast.success('Critério criado com sucesso');
                router.push('/ListCriteria');
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            }
        }
    }

    return (
        <div className={styles.registerCriteria}>
            <form onSubmit={handleSubmit(onSubmit)}>
                {Number(slug) > -1 ? (
                    <h1>Atualização do critério de avaliação</h1>
                ) : (
                    <h1>Cadastro dos critérios de avaliação</h1>
                )}

                <fieldset>
                    <legend>
                        <h2>Critério</h2>
                    </legend>

                    <div className={styles.field}>
                        <Controller
                            name='description'
                            control={control}
                            defaultValue=''
                            rules={{ required: 'Campo obrigatório' }}
                            render={({
                                field: { onChange, onBlur, value },
                                fieldState: { error },
                            }) => (
                                <TextField
                                    type='text'
                                    label='Descrição do critério'
                                    variant='outlined'
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    fullWidth
                                    value={value}
                                    error={!!error}
                                    helperText={!!error && error.message}
                                />
                            )}
                        />
                    </div>

                    <div className={styles.field}>
                        <Controller
                            name='weight'
                            control={control}
                            defaultValue={1}
                            rules={{
                                required: 'Campo obrigatório',
                                validate: {
                                    isValuePositive: (value) => {
                                        return (
                                            0 < value ||
                                            'Insira um peso acima de 0'
                                        );
                                    },
                                },
                            }}
                            render={({
                                field: { onChange, onBlur, value },
                                fieldState: { error },
                            }) => (
                                <TextField
                                    type='number'
                                    label='Peso do critério na avaliação'
                                    variant='outlined'
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    fullWidth
                                    value={value}
                                    error={!!error}
                                    helperText={!!error && error.message}
                                />
                            )}
                        />
                    </div>

                    <div className={styles.field}>
                        <Controller
                            name='unityType'
                            control={control}
                            defaultValue={1}
                            rules={{ required: 'Campo obrigatório' }}
                            render={({
                                field: { onChange, onBlur, value },
                                fieldState: { error },
                            }) => (
                                <TextField
                                    select
                                    label='Tipo de unidade'
                                    variant='outlined'
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    fullWidth
                                    value={value}
                                    error={!!error}
                                    helperText={!!error && error.message}
                                    SelectProps={{
                                        native: true,
                                    }}
                                >
                                    <option aria-label='None' value='' />
                                    {criteriaTypes.map((unit) => (
                                        <option
                                            key={unit.id}
                                            value={unit.value}
                                        >
                                            {unit.label}
                                        </option>
                                    ))}
                                </TextField>
                            )}
                        />
                    </div>
                </fieldset>

                <Button
                    variant='contained'
                    color='primary'
                    size='large'
                    startIcon={<MI.Save />}
                    type='submit'
                >
                    {Number(slug) > -1 ? (
                        <span>Atualizar Critério</span>
                    ) : (
                        <span>Cadastrar Critério</span>
                    )}
                </Button>
            </form>
        </div>
    );
}
