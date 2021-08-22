import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import { Button, InputAdornment, TextField } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import * as MI from '@material-ui/icons/';

import DateFnsUtils from '@date-io/date-fns';

import ptBR from 'date-fns/locale/pt-BR';
import format from 'date-fns/format';

import { api } from '../../services/api';

import styles from './styles.module.scss';
import { Controller, useForm } from 'react-hook-form';
import { AuthContext } from '../../contexts/AuthContext';

type FormData = {
    id?: number;
    name: string;
    description: string;
    completion: number;
    plannedStartDate: Date;
    plannedEndDate: Date;
}

export default function RegisterProjects(): JSX.Element {
    const { isAuthenticated } = useContext(AuthContext);
    const router = useRouter();
    const { slug } = router.query;

    const completionValidation = Number(slug) > -1 ? { 
        required: 'Campo obrigatório', 
        validate: { 
            isPositive: (value: number) => {
                return  value > 0 || 'Insira uma porcentagem de completude acima de 0';
            },
            isAboveHundred: (value: number) => {
                return  value <= 100 || 'Insira uma porcentagem de completude abaixo de 100';
            },
        }
    } : {};

    const newDate = new Date();
    const parsed = newDate.setMonth(newDate.getMonth() + 3);
    const standardEndDate = new Date(parsed);

    const startingForm = {
        name: '',
        description: '',
        completion: 0,
        plannedStartDate: newDate,
        plannedEndDate: standardEndDate,
    };

    const [formData, setFormData] = useState<FormData>(startingForm);

    const { handleSubmit, control, getValues, setValue} = useForm<FormData>({
        mode: 'all',
        defaultValues: startingForm,
    });

    useEffect(() => {
        async function getProject() {
            // const { data } = await api.get(`/projects/${slug}`);
            // const project = {
            //     id: data.idProject,
            //     name: data.name,
            //     description: data.description,
            //     completion: data.completion ? data.completion : 0,
            //     plannedStartDate: new Date(data.plannedStartDate),
            //     plannedEndDate: new Date(data.plannedEndDate)
            // };

            const project = {
                id: 36,
                name: 'Test testonious',
                description: 'descrita',
                completion: 76,
                plannedStartDate: new Date(newDate),
                plannedEndDate: standardEndDate
            };
            setFormData(project);
        }

        if (!isAuthenticated) {
            router.push('/');
            return;
        }

        if (!isNaN(Number(slug)) && Number(slug) > -1) {
            getProject();
        }
    }, []);

    useEffect(() => {
        const { name, description, completion, plannedStartDate, plannedEndDate } = formData;

        setValue('name', name);
        setValue('description', description);
        setValue('completion', completion);
        setValue('plannedStartDate', plannedStartDate);
        setValue('plannedEndDate', plannedEndDate);

    }, [formData]);

    async function onSubmit(data: FormData) {
        const { name, description, completion, plannedStartDate, plannedEndDate } = data;

        const requestData = {
            name,
            description,
            completion: Number(completion),
            plannedStartDate: format(plannedStartDate, 'yyyy-MM-dd HH:mm:ss', {
                locale: ptBR,
            }),
            plannedEndDate: format(plannedEndDate, 'yyyy-MM-dd HH:mm:ss', {
                locale: ptBR,
            }),
        };

        try {
            if (Number(slug) > -1) {
                await api.put(`projects/${slug}`, requestData);

                alert('Projeto atualizado com sucesso');
                router.push('/ListProjects');
            } else {
                await api.post('projects', requestData);

                alert('Projeto criado com sucesso');
                router.push('/ListProjects');
            }
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div className={styles.registerProject}>
            <form onSubmit={handleSubmit(onSubmit)}>
                { 
                    Number(slug) > -1 ? (
                        <h1>Atualização de Projeto</h1>
                    ) : (
                        <h1>Cadastro de Projeto</h1>
                    )
                }           

                <fieldset>
                    <legend>
                        <h2>Projeto</h2>
                    </legend>

                    <div className={styles.field}>
                        <Controller 
                            name='name'
                            control={control}
                            defaultValue=''
                            rules={{ required: 'Campo obrigatório' }}
                            render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                <TextField
                                    type='text'
                                    label='Nome do Projeto'
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
                            name='description'
                            control={control}
                            defaultValue=''
                            rules={{ required: 'Campo obrigatório' }}
                            render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                <TextField
                                    type='text'
                                    label='Descrição breve do Projeto'
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

                    {
                        Number(slug) > -1 && (
                            <div className={styles.field}>
                                <Controller 
                                    name='completion'
                                    control={control}
                                    defaultValue={0}
                                    rules={completionValidation}
                                    render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                        <TextField
                                            type='number'
                                            label='Completude do projeto'
                                            variant='outlined'
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            fullWidth
                                            InputProps={{endAdornment:<InputAdornment position='end'>%</InputAdornment>}}
                                            value={value}
                                            error={!!error}
                                            helperText={!!error && error.message}
                                        />
                                    ) }
                                />
                            </div>
                        )
                    }
                    
                    <div className={styles.field}>
                        <Controller 
                            name='plannedStartDate'
                            control={control}
                            defaultValue={newDate}
                            rules={{
                                required: 'Campo obrigatório',
                                validate: { 
                                    isValid: (value) => {
                                        return  !!value.getTime() || 'Insira uma data válida';
                                    },
                                    validateStartDateAfterEndDate: (value) => {
                                        const { plannedEndDate } = getValues();
                                        return value.getTime() <= plannedEndDate.getTime() || 'Insira uma data antes da data de encerramento';
                                    },
                                }
                            }}
                            render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR} >
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant='inline'
                                        inputVariant='outlined'
                                        format='dd/MM/yyyy'
                                        label='Data de início planejada'
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        value={value}
                                        fullWidth
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        error={!!error}
                                        helperText={!!error && error.message}
                                    />
                                </ MuiPickersUtilsProvider>
                            ) }
                        />
                    </div>

                    <div className={styles.field}>
                        <Controller 
                            name='plannedEndDate'
                            control={control}
                            defaultValue={standardEndDate}
                            rules={{ 
                                required: 'Campo obrigatório',
                                validate: { 
                                    isValid: (value) => {
                                        return !!value.getTime() || 'Insira uma data válida';
                                    }, 
                                    validateEndDateBeforeStartDate: (value) => {
                                        const { plannedStartDate } = getValues();
                                        return value.getTime() >= plannedStartDate.getTime() || 'Insira uma data depois da data de início';
                                    },
                                }
                            }}
                            render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR} >
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant='inline'
                                        inputVariant='outlined'
                                        format='dd/MM/yyyy'
                                        label='Data de encerramento planejado'
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        value={value}
                                        fullWidth
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                        error={!!error}
                                        helperText={!!error && error.message}
                                    />
                                </ MuiPickersUtilsProvider>
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
                            <span>Atualizar Projeto</span>
                        ) : (
                            <span>Cadastrar Projeto</span>
                        )
                    }   
                </Button>
            </form>
        </div>
    );
}
