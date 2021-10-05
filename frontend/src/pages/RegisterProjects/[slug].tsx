import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import { Button, Dialog, InputAdornment, List, ListItemText, Paper, TextField, DialogTitle } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import * as MI from '@material-ui/icons/';

import DateFnsUtils from '@date-io/date-fns';

import ptBR from 'date-fns/locale/pt-BR';
import format from 'date-fns/format';

import { api } from '../../services/api';

import styles from './styles.module.scss';
import { Controller, useForm } from 'react-hook-form';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { CancelConfirmation } from '../../components/CancelConfirmation';
import { FinishConfirmation } from '../../components/FinishConfirmation';
import { Autocomplete } from '@material-ui/lab';

type Person = {
    personId: number;
    name: string;
}

type FormData = {
    portfolioId?: number;
    submitter?: number;
    status: number;
    id?: number;
    name: string;
    description: string;
    completion: number;
    plannedStartDate: Date;
    plannedEndDate: Date;
    responsible?: Person;
}

type RequestData = {
    portfolioId: number;
    submitter: number;
    name: string;
    description: string;
    completion: number;
    plannedStartDate: string;
    plannedEndDate: string;
    status?: number;
}

type Evaluation = {
    evaluationDate: string;
    grade: string;
}

export default function RegisterProjects(): JSX.Element {
    const { isAuthenticated, user } = useContext(AuthContext);
    const router = useRouter();
    const { slug } = router.query;

    const newDate = new Date();
    const parsed = newDate.setMonth(newDate.getMonth() + 3);
    const standardEndDate = new Date(parsed);

    const startingForm = {
        name: '',
        description: '',
        status: 1,
        completion: 0,
        responsible: {
            personId: 0,
            name: '',
        },
        plannedStartDate: new Date(),
        plannedEndDate: standardEndDate,
    };

    const [persons, setPersons] = useState<Person[]>([]);
    const [formData, setFormData] = useState<FormData>(startingForm);
    const [showDialogEvaluation, setShowDialogEvaluation] = useState<boolean>(false);
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

    const { handleSubmit, control, getValues, setValue} = useForm<FormData>({
        mode: 'all',
        defaultValues: startingForm,
    });

    const completionValidation = Number(slug) > -1 ? { 
        required: 'Campo obrigatório', 
        validate: { 
            isPositive: (value: number) => {
                return  value >= 0 || 'Insira uma porcentagem de completude de 0 ou acima';
            },
            isAboveHundred: (value: number) => {
                return  value <= 100 || 'Insira uma porcentagem de completude abaixo de 100';
            },
        }
    } : {};

    const responsibleValidation = (Number(slug) > -1 && formData.status === 4) ? {
        required: 'Campo obrigatório'
    } : {};

    useEffect(() => {
        async function getProject() {
            try {
                const { data:personResponse } = await api.get(`/personsOrganization/${user.idOrganization}`);
                const personData = personResponse.map((person) => {
                    return {
                        personId: person.id_person,
                        name: person.name,
                    };
                });
    
                setPersons(personData);


                const { data } = await api.get(`/projects/${slug}`);

                const responsible: Person = personData.find((person) => person.personId === data.responsible);

                const project = {
                    id: data.idProject,
                    name: data.name,
                    description: data.description,
                    status: data.id_status,
                    responsible: responsible,
                    completion: data.completion ? data.completion : 0,
                    plannedStartDate: new Date(data.planned_start_date),
                    plannedEndDate: new Date(data.planned_end_date)
                };

                setFormData(project);
            } catch (error) {
                toast.error(error.response.data.message);
            } 
        }

        if (!isAuthenticated) {
            router.push('/Login');
            return;
        }

        if (!isNaN(Number(slug)) && Number(slug) > -1) {
            getProject();
        }
    }, []);

    useEffect(() => {
        const { name, description, completion, plannedStartDate, plannedEndDate, status, responsible } = formData;

        setValue('name', name);
        setValue('description', description);
        setValue('completion', completion);
        setValue('status', status);
        setValue('responsible', responsible);
        setValue('plannedStartDate', plannedStartDate);
        setValue('plannedEndDate', plannedEndDate);

    }, [formData]);

    useEffect(() => {
        async function getProjectEvaluation() {
            try {
                const { data } = await api.get(`/projectsEvaluations/${slug}`);

                const evaluations = data.map((evaluation) => {
                    return {
                        evaluationDate: format(new Date(evaluation.evaluation_date), 'dd/MM/yyyy', {
                            locale: ptBR,
                        }),
                        grade: `${evaluation.finalGrade}`.replace('.', ',')
                    };
                });
                setEvaluations(evaluations);
            } catch (error) {
                toast.error(error.response.data.message);
            } 
        }

        if (showDialogEvaluation){
            getProjectEvaluation();
        }
    }, [showDialogEvaluation]);

    async function onSubmit(data: FormData) {
        try{

            const { data:portfolioData } = await api.get(`/portfolios/${user.idOrganization}`);

            const portfolioId = portfolioData.id_portfolio;

            const submitter = user.id;

            const { name, description, completion, plannedStartDate, plannedEndDate } = data;

            const requestData: RequestData = {
                portfolioId: Number(portfolioId),
                submitter,
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

            if (Number(slug) > -1) {
                if (data.status && data.status === 6){
                    requestData.status = 1;
                }

                await api.put(`projects/${slug}`, requestData);

                toast.success('Projeto atualizado com sucesso');
                router.push('/ListProjects');
            } else {
                await api.post('projects', requestData);

                toast.success('Projeto criado com sucesso');
                router.push('/ListProjects');
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } 
    }

    async function stopProject() {
        try{
            await api.put(`stopProject/${slug}`);

            toast.success('Projeto paralisado com sucesso');
            router.push('/ListProjects');
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    async function finishProject() {
        const response = await FinishConfirmation();

        if(!response){
            return;
        }

        try{
            await api.put(`finishProject/${slug}`);

            toast.success('Projeto Finalizado com sucesso');
            router.push('/ListProjects');
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    async function restartProject() {
        try{
            await api.put(`restartProject/${slug}`);

            toast.success('Projeto retomado com sucesso');
            router.push('/ListProjects');
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    async function cancelProject() {
        const response = await CancelConfirmation();

        if(!response){
            return;
        }

        try{
            await api.put(`cancelProject/${slug}`);

            toast.success('Projeto cancelado com sucesso');
            router.push('/ListProjects');
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    function showEvaluations() {
        setShowDialogEvaluation(true);
    }

    function handleClose() {
        setShowDialogEvaluation(false);
    }

    return (
        <>
            <div className={styles.registerProject}>
                <div className={styles.buttonHeadbar}>
                    {
                        (Number(slug) > -1 && formData.status !== 1) && (
                            <Button
                                size='large'
                                onClick={showEvaluations}
                            >
                                Ver Avaliações
                            </Button>
                        )
                    }
                    {
                        (formData.status === 4) && (
                            <>
                                <Button
                                    variant='contained'
                                    color='secondary'
                                    size='large'
                                    onClick={stopProject}
                                >
                                    Paralisar Projeto
                                </Button>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    size='large'
                                    disabled={(formData.completion !== 100)}
                                    onClick={finishProject}
                                >
                                    Finalizar Projeto
                                </Button>
                            </>
                        )
                    }
                    {
                        (formData.status === 8) && (
                            <>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    size='large'
                                    onClick={restartProject}
                                >
                                    Retomar Projeto
                                </Button>
                                <Button
                                    variant='contained'
                                    color='secondary'
                                    size='large'
                                    onClick={cancelProject}
                                >
                                    Cancelar Projeto
                                </Button>
                            </>
                        )
                    }
                </div>
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
                            (Number(slug) > -1 && formData.status === 4) && (
                                <>
                                    <div className={styles.field}>
                                        <Controller 
                                            name='responsible'
                                            control={control}
                                            rules={responsibleValidation}
                                            render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                                <Autocomplete
                                                    value={value}
                                                    options={persons}
                                                    getOptionLabel={(option) => option.name}
                                                    onBlur={onBlur}
                                                    fullWidth
                                                    onChange={(e, data) => onChange(data)}
                                                    renderInput={ (params) => 
                                                        <TextField 
                                                            {...params}
                                                            label='Responsável'
                                                            variant='outlined'
                                                            className={styles.textField}
                                                            error={!!error}
                                                            helperText={!!error && error.message}
                                                        />
                                                    }
                                                />
                                            ) }
                                        />
                                    </div>
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
                                </>
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
            <Dialog className={styles.dialog} onClose={handleClose} aria-labelledby='show-evaluations' open={showDialogEvaluation}>
                <DialogTitle>
                    Avaliações do projeto
                </DialogTitle>
                <Paper elevation={3}>
                    <List className={styles.dataList}>
                        {
                            evaluations.map((evaluation, index) => {
                                return (
                                    <ListItemText 
                                        key={index}
                                        primary={`
                                            Avaliado em: ${evaluation.evaluationDate} - Nota: ${evaluation.grade}
                                        `} 
                                    />
                                );
                            })
                        }
                    </List>
                </Paper>
            </Dialog>
        </>
    );
}
