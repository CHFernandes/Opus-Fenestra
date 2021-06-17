import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/router';


import { Button, InputAdornment, TextField } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import * as MI from '@material-ui/icons/';

import DateFnsUtils from '@date-io/date-fns';

import ptBR from 'date-fns/locale/pt-BR';
import format from 'date-fns/format';

import { api } from '../../services/api';

import styles from './styles.module.scss';

type FormData = {
    id?: number;
    name: string;
    description: string;
    completion: number;
    plannedStartDate: string;
    plannedEndDate: string;
}

export default function RegisterProjects() {
    const router = useRouter();
    const { slug } = router.query;

    const newDate = new Date();
    const parsed = newDate.setMonth(newDate.getMonth() + 3);
    const standardEndDate = new Date(parsed);
    

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        completion: 0,
        plannedStartDate: new Date(),
        plannedEndDate: standardEndDate,
    });

    const [errors, setErrors] = useState({
        completion: false,
        plannedStartDate: false,
        plannedEndDate: false,
    });

    useEffect(() => {
        async function getProject() {
            const { data } = await api.get(`/projects/${slug}`);
            const project = {
                id: data.idProject,
                name: data.name,
                description: data.description,
                completion: !!data.completion ? data.completion : 0,
                plannedStartDate: new Date(data.plannedStartDate),
                plannedEndDate: new Date(data.plannedEndDate)
            };
            setFormData(project);
        }

        if (!isNaN(Number(slug)) && Number(slug) > -1) {
            getProject();
        }
    }, []);

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        resetValidation();
        const { name, value } = event.target;
        handleValidation( name, value );
        setFormData({ ...formData, [name]: value});
    }

    const handleStartDateChange = (date: Date | null) => {
        resetValidation();
        handleValidation( 'plannedStartDate', date );
        setFormData({ ...formData, plannedStartDate: date});
    };

    const handleEndDateChange = (date: Date | null) => {
        resetValidation();
        handleValidation( 'plannedEndDate', date);
        setFormData({ ...formData, plannedEndDate: date});
    };

    async function handleSubmit(event: FormEvent){
        event.preventDefault();

        if (errors.completion || errors.plannedEndDate) {
            return;
        }

        const { name, description, completion, plannedStartDate, plannedEndDate } = formData;
        
            const data: FormData = {
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
                    const response = await api.put(`projects/${slug}`, data);

                    alert('Projeto atualizado com sucesso');
                    router.push('/ListProjects')
                } else {
                    const response = await api.post('projects', data);

                    alert('Projeto criado com sucesso');
                    router.push('/ListProjects');
                }
            } catch (err) {
                alert(err.message);
            }
    }

    function resetValidation() {
        setErrors({
            completion: false,
            plannedStartDate: false,
            plannedEndDate: false,
        });
    }

    async function handleValidation(field: string, value: string | Date) {
        if(field === 'completion') {
            const completion = Number(value);
            if(completion < 0) {
                setErrors({...errors, completion: true});
            }
        }

        if(field === 'plannedStartDate') {
            const plannedStartDate = new Date(value);
            const plannedEndDate = formData.plannedEndDate;
            if(plannedEndDate.getTime() <= plannedStartDate.getTime()) {
                setErrors({...errors, plannedEndDate: true});
            }
        }

        if(field === 'plannedEndDate') {
            const plannedStartDate = formData.plannedStartDate;
            const plannedEndDate = new Date(value);
            if(plannedEndDate.getTime() <= plannedStartDate.getTime()) {
                setErrors({...errors, plannedEndDate: true});
            }
        }

    }
    return (
        <div className={styles.registerProject}>
            <form onSubmit={handleSubmit}>
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
                        <TextField
                            required
                            name='name'
                            type='text'
                            label='Nome do Projeto'
                            variant='outlined'
                            onChange={handleInputChange}
                            fullWidth
                            value={formData.name}
                        />
                    </div>
                    
                    <div className={styles.field}>
                        <TextField
                            required
                            name='description'
                            type='text'
                            label='Descrição breve do Projeto'
                            variant='outlined'
                            onChange={handleInputChange}
                            fullWidth
                            value={formData.description}
                        />
                    </div>

                    {
                        Number(slug) > -1 && (
                            <div className={styles.field}>
                                <TextField
                                    required= { Number(slug) > -1 ? true : false }
                                    error={!!errors.completion}
                                    helperText={!!errors.completion && 'Insira uma porcentagem de completude acima de 0'}
                                    name='completion'
                                    type='number'
                                    label='Completude do projeto'
                                    variant='outlined'
                                    onChange={handleInputChange}
                                    fullWidth
                                    InputProps={{endAdornment:<InputAdornment position='end'>%</InputAdornment>}}
                                    value={formData.completion}
                                />
                            </div>
                        )
                    }
                    
                    <div className={styles.field}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR} >
                            <KeyboardDatePicker
                                required
                                disableToolbar
                                variant='inline'
                                inputVariant='outlined'
                                format="dd/MM/yyyy"
                                name='plannedStartDate'
                                label="Data de início planejada"
                                value={formData.plannedStartDate}
                                onChange={handleStartDateChange}
                                fullWidth
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </ MuiPickersUtilsProvider>
                    </div>

                    <div className={styles.field}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR} >
                            <KeyboardDatePicker
                                required
                                disableToolbar
                                variant='inline'
                                inputVariant='outlined'
                                format="dd/MM/yyyy"
                                name='plannedEndDate'
                                label="Data de encerramento planejado"
                                value={formData.plannedEndDate}
                                onChange={handleEndDateChange}
                                fullWidth
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                error={!!errors.plannedEndDate}
                                helperText={!!errors.plannedEndDate && 'Insira uma data depois da data de início'}
                            />
                        </ MuiPickersUtilsProvider>
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
