import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import { Button, TextField } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import * as MI from '@material-ui/icons';

import { api } from '../../services/api';
import styles from './styles.module.scss';
import { AuthContext } from '../../contexts/AuthContext';


type FormData = {
    id?: number;
    description: string;
    weight: number;
    unityType: string;
    bestValue: number;
    worstValue: number;
}

export default function RegisterCriteria(): JSX.Element {
    const { isAuthenticated } = useContext(AuthContext);
    const router = useRouter();
    const { slug } = router.query;

    const startingForm = {
        description: '',
        weight: undefined,
        unityType: '',
        bestValue: undefined,
        worstValue: undefined,
    };

    const [formData, setFormData] = useState<FormData>(startingForm);

    const { handleSubmit, control, setValue} = useForm<FormData>({
        mode: 'all',
        defaultValues: startingForm,
    });

    useEffect(() => {
        async function getCriterion() {
            // const { data } = await api.get(`/criteria/${slug}`);
            // const dataParsed = data;
            // const criterion = {
            //     id: dataParsed.idCriteria,
            //     description: dataParsed.description,
            //     weight: dataParsed.weight,
            //     unityType: dataParsed.unityType,
            //     bestValue: dataParsed.bestValue,
            //     worstValue: dataParsed.worstValue,
            // };

            const criterion = {
                id: 36,
                description: 'descrita',
                weight: 6,
                unityType: 'Escala de 10',
                bestValue: 10,
                worstValue: 0,
            };
            setFormData(criterion);
        }

        if (!isAuthenticated) {
            router.push('/');
            return;
        }

        if (!isNaN(Number(slug)) && Number(slug) > -1) {
            getCriterion();
        }
    }, []);

    useEffect(() => {
        const { description, weight, unityType, bestValue, worstValue} = formData;

        setValue('description', description);
        setValue('weight', weight);
        setValue('unityType', unityType);
        setValue('bestValue', bestValue);
        setValue('worstValue', worstValue);

    }, [formData]);

    async function onSubmit(data: FormData) {
        const { description, weight, unityType, bestValue, worstValue } = data;

        const requestData: FormData = {
            description: description,
            weight: Number(weight),
            unityType: unityType,
            bestValue: Number(bestValue),
            worstValue: Number(worstValue)
        };

        try {
            if (Number(slug) > -1) {
                await api.put(`criteria/${slug}`, requestData);

                alert('Critério atualizado com sucesso');
                router.push('/ListCriteria');
            } else {
                await api.post('criteria', requestData);

                alert('Critério criado com sucesso');
                router.push('/ListCriteria');
            }
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div className={styles.registerCriteria}>
            <form onSubmit={handleSubmit(onSubmit)}>
                { 
                    Number(slug) > -1 ? (
                        <h1>Atualização do critério de avaliação</h1>
                    ) : (
                        <h1>Cadastro dos critérios de avaliação</h1>
                    )
                }           

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
                            render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
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
                            ) }
                        />
                    </div>

                    <div className={styles.field}>
                        <Controller 
                            name='weight'
                            control={control}
                            defaultValue={undefined}
                            rules={{ 
                                required: 'Campo obrigatório',
                                validate: { isValuePositive: (value) => {
                                    return 0 < value || 'Insira um peso acima de 0';
                                } }
                            }}
                            render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
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
                            ) }
                        />
                    </div>

                    <div className={styles.field}>
                        <Controller 
                            name='unityType'
                            control={control}
                            defaultValue=''
                            rules={{ required: 'Campo obrigatório' }}
                            render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                <TextField
                                    type='text'
                                    label='Tipo de unidade'
                                    variant='outlined'
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    fullWidth
                                    value={value}
                                    error={!!error}
                                    helperText={!!error && error.message}
                                />
                            ) }
                        />
                    </div>

                    <div className={styles.field}>
                        <Controller 
                            name='bestValue'
                            control={control}
                            defaultValue={undefined}
                            rules={{ required: 'Campo obrigatório' }}
                            render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                <TextField
                                    type='number'
                                    label='Valor Mais Esperado'
                                    variant='outlined'
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    fullWidth
                                    value={value}
                                    error={!!error}
                                    helperText={!!error && error.message}
                                />
                            ) }
                        />
                    </div>

                    <div className={styles.field}>
                        <Controller 
                            name='worstValue'
                            control={control}
                            defaultValue={undefined}
                            rules={{ required: 'Campo obrigatório' }}
                            render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                <TextField
                                    type='number'
                                    label='Valor Menos Esperado'
                                    variant='outlined'
                                    onBlur={onBlur}
                                    onChange={onChange}
                                    fullWidth
                                    value={value}
                                    error={!!error}
                                    helperText={!!error && error.message}
                                />
                            ) }
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
                    { 
                        Number(slug) > -1 ? (
                            <span>Atualizar Critério</span>
                        ) : (
                            <span>Cadastrar Critério</span>
                        )
                    }   
                </Button>
            </form>
        </div>
    );
}
