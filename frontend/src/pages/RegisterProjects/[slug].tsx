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

export default function RegisterProjects(): JSX.Element {
    const router = useRouter();
    const { slug } = router.query;

    const newDate = new Date();
    const parsed = newDate.setMonth(newDate.getMonth() + 3);
    const standardEndDate = new Date(parsed);
    const [valid, setValid] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        completion: 0,
        plannedStartDate: new Date(),
        plannedEndDate: standardEndDate,
    });

    const [errors, setErrors] = useState({
        name: {
            valid: true,
            message: '',
        },
        description: {
            valid: true,
            message: '',
        },
        completion: {
            valid: true,
            message: '',
        },
        plannedStartDate: {
            valid: true,
            message: '',
        },
        plannedEndDate: {
            valid: true,
            message: '',
        },
    });

    useEffect(() => {
        async function getProject() {
            const { data } = await api.get(`/projects/${slug}`);
            const project = {
                id: data.idProject,
                name: data.name,
                description: data.description,
                completion: data.completion ? data.completion : 0,
                plannedStartDate: new Date(data.plannedStartDate),
                plannedEndDate: new Date(data.plannedEndDate)
            };
            setFormData(project);
            resetValidation();
        }

        if (!isNaN(Number(slug)) && Number(slug) > -1) {
            getProject();
        }
    }, []);

    useEffect(() => {
        if (errors.name.valid &&
            errors.description.valid &&
            errors.completion.valid &&
            errors.plannedStartDate.valid &&
            errors.plannedEndDate.valid) {
                setValid(true);
                return;
        }
        setValid(false);
        return;

    }, [errors]);

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const { name, value } = event.target;
        handleValidation( name, value );
        setFormData({ ...formData, [name]: value});
    }

    const handleStartDateChange = (date: Date | null) => {
        handleValidation( 'plannedStartDate', date );
        setFormData({ ...formData, plannedStartDate: date});
    };

    const handleEndDateChange = (date: Date | null) => {
        handleValidation( 'plannedEndDate', date);
        setFormData({ ...formData, plannedEndDate: date});
    };

    function handleSubmit(event: FormEvent){
        event.preventDefault();

        handleLazyValidation();
        
        if (!!formData.name && !!formData.description) {
            handlePost();
        }
    }

    function handleLazyValidation () {
        if (!formData.name) {
            setErrors(previousErrors => ({
                ...previousErrors,
                name: {valid: false, message:'Obrigatório'
            }}));
        }
        if (!formData.description) {
            setErrors(previousErrors => ({
                ...previousErrors,
                description: {valid: false, message:'Obrigatório'
            }}));
        }
    }

    async function handlePost() {
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
                await api.put(`projects/${slug}`, data);

                alert('Projeto atualizado com sucesso');
                router.push('/ListProjects');
            } else {
                await api.post('projects', data);

                alert('Projeto criado com sucesso');
                router.push('/ListProjects');
            }
        } catch (err) {
            alert(err.message);
        }
    }

    function resetValidation() {
        setErrors({
            name: {
                valid: true,
                message: '',
            },
            description: {
                valid: true,
                message: '',
            },
            completion: {
                valid: true,
                message: '',
            },
            plannedStartDate: {
                valid: true,
                message: '',
            },
            plannedEndDate: {
                valid: true,
                message: '',
            },
        });
    }

    function handleValidation(field: string, value: string | Date) {
        if(field === 'name') {
            if (!value) {
                setErrors({...errors, name: {valid: false, message:'Obrigatório'}});
                return;
            }
            setErrors({...errors, name: {valid: true, message:''}});
            return;
        }

        if(field === 'description'){
            if (!value) {
                setErrors({...errors, description: {valid: false, message:'Obrigatório'}});
                return;
            }
            setErrors({...errors, description: {valid: true, message:''}});
            return;
        }

        if(field === 'completion') {
            if (!value) {
                setErrors({...errors, completion: {valid: false, message:'Obrigatório'}});
                return;
            }

            const completion = Number(value);
            if(completion < 0) {
                setErrors({...errors, completion: {valid: false, message:'Insira uma porcentagem de completude acima de 0'}});
                return;
            } 

            setErrors({...errors, completion: {valid: true, message:''}});
            return;
        }

        if(field === 'plannedStartDate') {
            if (!value) {
                setErrors({...errors, plannedStartDate: {valid: false, message:'Obrigatório'}});
                return;
            }

            const plannedStartDate = new Date(value);
            if(!plannedStartDate.getTime()) {
                setErrors({...errors, plannedStartDate: {valid: false, message:'Insira uma data válida'}});
                return;
            }

            const plannedEndDate = formData.plannedEndDate;
            if(plannedEndDate.getTime() <= plannedStartDate.getTime()) {
                setErrors({...errors, plannedStartDate: {valid: false, message:'Insira uma data antes da data de encerramento'}});
                return;
            }
            setErrors({...errors, plannedStartDate: {valid: true, message:''}});
            return;
        }

        if(field === 'plannedEndDate') {
            if (!value) {
                setErrors({...errors, plannedEndDate: {valid: false, message:'Obrigatório'}});
                return;
            }

            const plannedEndDate = new Date(value);
            if(!plannedEndDate.getTime()) {
                setErrors({...errors, plannedEndDate: {valid: false, message:'Insira uma data válida'}});
                return;
            }

            const plannedStartDate = formData.plannedStartDate;
            if(plannedEndDate.getTime() <= plannedStartDate.getTime()) {
                setErrors({...errors, plannedEndDate: {valid: false, message:'Insira uma data depois da data de início'}});
                return;
            }

            setErrors({...errors, plannedEndDate: {valid: true, message:''}});
            return;
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
                            name='name'
                            type='text'
                            label='Nome do Projeto'
                            variant='outlined'
                            onChange={handleInputChange}
                            fullWidth
                            value={formData.name}
                            error={!errors.name.valid}
                            helperText={!errors.name.valid && errors.name.message}
                        />
                    </div>
                    
                    <div className={styles.field}>
                        <TextField
                            name='description'
                            type='text'
                            label='Descrição breve do Projeto'
                            variant='outlined'
                            onChange={handleInputChange}
                            fullWidth
                            value={formData.description}
                            error={!errors.description.valid}
                            helperText={!errors.description.valid && errors.description.message}
                        />
                    </div>

                    {
                        Number(slug) > -1 && (
                            <div className={styles.field}>
                                <TextField
                                    required= { Number(slug) > -1 ? true : false }
                                    error={!errors.completion.valid}
                                    helperText={!errors.completion.valid && errors.completion.message}
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
                                disableToolbar
                                variant='inline'
                                inputVariant='outlined'
                                format='dd/MM/yyyy'
                                name='plannedStartDate'
                                label='Data de início planejada'
                                value={formData.plannedStartDate}
                                onChange={handleStartDateChange}
                                fullWidth
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                error={!errors.plannedStartDate.valid}
                                helperText={!errors.plannedStartDate.valid && errors.plannedStartDate.message}
                            />
                        </ MuiPickersUtilsProvider>
                    </div>

                    <div className={styles.field}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBR} >
                            <KeyboardDatePicker
                                disableToolbar
                                variant='inline'
                                inputVariant='outlined'
                                format='dd/MM/yyyy'
                                name='plannedEndDate'
                                label='Data de encerramento planejado'
                                value={formData.plannedEndDate}
                                onChange={handleEndDateChange}
                                fullWidth
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                error={!errors.plannedEndDate.valid}
                                helperText={!errors.plannedEndDate.valid && errors.plannedEndDate.message}
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
                    disabled={!valid}
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
