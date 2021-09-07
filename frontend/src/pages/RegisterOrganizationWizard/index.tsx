import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { Button, Step, Stepper, StepLabel, TextField, List, ListItem, ListItemText } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import * as MI from '@material-ui/icons/';

import { api } from '../../services/api';

import styles from './styles.module.scss';
import toast from 'react-hot-toast';

type OrganizationForm = {
    organizationName: string;
    mission: string;
    values: string;
    vision: string;
}

type AdminForm = {
    name: string;
    user: string;
    email: string;
    password: string;
    confirmPassword: string;
}

type SubmitForm = {
    organizationName: string;
    mission: string;
    values: string;
    vision: string;
    name: string;
    user: string;
    email: string;
    password: string;
}

export default function RegisterOrganizationWizard(): JSX.Element {
    const router = useRouter();
    const startingform = {
        organizationName: '',
        mission: '',
        values: '',
        vision: '',
        name: '',
        user: '',
        email: '',
        password: '',
    };
    const { handleSubmit: handleSubmitOrganization, control: controlOrganization } = useForm<OrganizationForm>({mode: 'all'});
    const { handleSubmit: handleSubmitAdmin, control: controlAdmin, getValues} = useForm<AdminForm>({mode: 'all'});
    const [activeStep, setActiveStep] = useState(0);
    const [form, setForm] = useState<SubmitForm>(startingform);

    const steps = ['Dados da organização', 'Dados do administrador', 'Revisar Dados'];

    function handleNext () {
        setActiveStep((previousActiveStep) => previousActiveStep + 1);
    }

    function handleBack () {
        setActiveStep((previousActiveStep) => previousActiveStep - 1);
    }

    function onSubmitOrganization(data: OrganizationForm) {
        const { organizationName, mission, values, vision } = data;
        setForm(currentForm => ({
            ...currentForm,
            organizationName,
            mission,
            values,
            vision,
        }));
        handleNext();
        return;
    }

    function onSubmitAdmin(data: AdminForm) {
        const { email, password, name, user } = data;
        setForm(currentForm => ({
            ...currentForm,
            email,
            password,
            name,
            user,
        }));
        handleNext();
        return;
    }

    async function onSubmitForm() {

        let resultOrganization = null;

        const { 
            email,
            mission,
            name,
            organizationName,
            password,
            user,
            values,
            vision
         } = form;

        try {
            const organizationRequestData = {
                name: organizationName,
                mission,
                vision,
                values,
            };

            resultOrganization = await api.post('organizations', organizationRequestData);

            toast.success('Organização criada com sucesso');

            if (!resultOrganization) {
                return;
            }

            const personRequestData = {
                organizationId: resultOrganization.data.id_organization,
                personaId: 1,
                email,
                name,
                password,
                user,
            };

            const resultPerson = await api.post('persons', personRequestData);

            if (!resultPerson) {
                return;
            }

            toast.success('Usuário criado com sucesso');

            const portfolioRequestData = {
                organizationId: resultOrganization.data.id_organization,
                personId: resultPerson.data.id_person,
                description: `Portfolio da organização: ${organizationName}`,
                objective: `Portfolio principal da organização ${organizationName}`,
            };

            const resultPortfolio = await api.post('portfolios', portfolioRequestData);

            if (resultPortfolio) {
                router.push('/Login');
            }

        } catch (error) {
            toast.error(error.response.data.message);
        } 

        return;
    }

    return (
        <div className={styles.wizardWrapper}>
            <Stepper className={styles.stepperWrapper} activeStep={activeStep} alternativeLabel>
                { steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {
                activeStep === 0 && ( 
                    <form className={styles.stepWrapper} onSubmit={handleSubmitOrganization(onSubmitOrganization)}>
                        <div className={styles.stepWrapper}>
                            <div className={styles.stepTitle}>
                                <h1>Dados da organização</h1>
                            </div>
                            <div className={styles.formFields}>
                                <div className={styles.field}>
                                    <Controller 
                                        name='organizationName'
                                        control={controlOrganization}
                                        defaultValue=''
                                        rules={{ required: 'Campo obrigatório' }}
                                        render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                            <TextField
                                                type='text'
                                                label='Nome da Organização'
                                                variant='outlined'
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                fullWidth
                                                value={value}
                                                error={!!error}
                                                helperText={error && error.message}
                                            />
                                        ) }
                                    />
                                </div>
                                <div className={styles.field}>
                                    <Controller 
                                        name='mission'
                                        control={controlOrganization}
                                        defaultValue=''
                                        rules={{ required: 'Campo obrigatório' }}
                                        render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                            <TextField
                                                type='text'
                                                label='Missão da Organização'
                                                variant='outlined'
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                fullWidth
                                                value={value}
                                                error={!!error}
                                                helperText={error && error.message}
                                            />
                                        ) }
                                    />
                                </div>
                                <div className={styles.field}>
                                    <Controller 
                                        name='values'
                                        control={controlOrganization}
                                        defaultValue=''
                                        rules={{ required: 'Campo obrigatório' }}
                                        render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                            <TextField
                                                type='text'
                                                label='Valores da Organização'
                                                variant='outlined'
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                fullWidth
                                                value={value}
                                                error={!!error}
                                                helperText={error && error.message}
                                            />
                                        ) }
                                    />
                                </div>
                                <div className={styles.field}>
                                    <Controller 
                                        name='vision'
                                        control={controlOrganization}
                                        defaultValue=''
                                        rules={{ required: 'Campo obrigatório' }}
                                        render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                            <TextField
                                                type='text'
                                                label='Visão da Organização'
                                                variant='outlined'
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                fullWidth
                                                value={value}
                                                error={!!error}
                                                helperText={error && error.message}
                                            />
                                        ) }
                                    />
                                </div>
                            </div>
                        </div> 
                        <div className={styles.buttonWrapper}>
                            <Button
                                variant='contained'
                                size='large'
                                onClick={() => (router.push('/'))}
                                startIcon={<MI.ChevronLeft />}
                            >
                                Retornar para o Login
                            </Button>
                            <Button
                                variant='contained'
                                size='large'
                                color='primary'
                                type='submit'
                                endIcon={<MI.ChevronRight />}
                            >
                                Próximo
                            </Button>
                        </div>
                    </form>
                )
            }   
            {
                activeStep === 1 && ( 
                    <form className={styles.stepWrapper} onSubmit={handleSubmitAdmin(onSubmitAdmin)}>
                        <div className={styles.stepWrapper}>
                            <div className={styles.stepTitle}>
                                <h1>Dados do Administrador da Organização</h1>
                            </div>
                            <div className={styles.formFields}>
                                <div className={styles.field}>
                                    <Controller 
                                        name='name'
                                        control={controlAdmin}
                                        defaultValue=''
                                        rules={{ required: 'Campo obrigatório' }}
                                        render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                            <TextField
                                                type='text'
                                                label='Nome Completo'
                                                variant='outlined'
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                fullWidth
                                                value={value}
                                                error={!!error}
                                                helperText={error && error.message}
                                            />
                                        ) }
                                    />
                                </div>
                                <div className={styles.field}>
                                    <Controller 
                                        name='user'
                                        control={controlAdmin}
                                        defaultValue=''
                                        rules={{ required: 'Campo obrigatório' }}
                                        render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                            <TextField
                                                type='text'
                                                label='Nome de usuário'
                                                variant='outlined'
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                fullWidth
                                                value={value}
                                                error={!!error}
                                                helperText={error && error.message}
                                            />
                                        ) }
                                    />
                                </div>
                                <div className={styles.field}>
                                    <Controller 
                                        name='email'
                                        control={controlAdmin}
                                        defaultValue=''
                                        rules={{
                                            required: 'Campo obrigatório',
                                            validate: { isEmailValid: (value) => {
                                                // validação de email por regex
                                                // eslint-disable-next-line no-useless-escape
                                                const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                                return regex.test(value) || 'Insira um e-mail valido';
                                            } }
                                        }}
                                        render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                            <TextField
                                                type='email'
                                                label='Email'
                                                variant='outlined'
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                fullWidth
                                                value={value}
                                                error={!!error}
                                                helperText={error && error.message}
                                            />
                                        ) }
                                    />
                                </div>
                                <div className={styles.field}>
                                    <Controller 
                                        name='password'
                                        control={controlAdmin}
                                        defaultValue=''
                                        rules={{ required: 'Campo obrigatório' }}
                                        render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                            <TextField
                                                type='password'
                                                label='Senha'
                                                variant='outlined'
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                fullWidth
                                                value={value}
                                                error={!!error}
                                                helperText={error && error.message}
                                            />
                                        ) }
                                    />
                                </div>
                                <div className={styles.field}>
                                    <Controller 
                                        name='confirmPassword'
                                        control={controlAdmin}
                                        defaultValue=''
                                        rules={{
                                            required: 'Campo obrigatório',
                                            validate: { isPasswordsMatches: (value) => { 
                                                const { password } = getValues();
                                                return password === value || 'Senhas devem ser iguais';
                                            } }
                                        }}
                                        render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                            <TextField
                                                type='password'
                                                label='Confirmar Senha'
                                                variant='outlined'
                                                onBlur={onBlur}
                                                onChange={onChange}
                                                fullWidth
                                                value={value}
                                                error={!!error}
                                                helperText={error && error.message}
                                            />
                                        ) }
                                    />
                                </div>
                            </div>
                        </div> 
                        <div className={styles.buttonWrapper}>
                                <Button
                                    variant='contained'
                                    size='large'
                                    onClick={handleBack}
                                    startIcon={<MI.ChevronLeft />}
                                >
                                    Voltar
                                </Button>
                                <Button
                                    variant='contained'
                                    size='large'
                                    color='primary'
                                    type='submit'
                                    endIcon={<MI.ChevronRight />}
                                >
                                    Próximo
                                </Button>
                        </div>
                    </form>
                )
            }
            {
                activeStep === 2 && ( 
                    <div className={styles.stepWrapper}>
                        <div className={styles.stepTitle}>
                            <h1>Dados da Organização</h1>
                        </div>
                        <List className={styles.dataList}>
                            <ListItem>
                                <ListItemText
                                    primary='Nome da Organização'
                                    secondary={form.organizationName}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary='Missão da organização'
                                    secondary={form.mission}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText 
                                    primary='Visão da organização' 
                                    secondary={form.vision}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary='Valores da organização'
                                    secondary={form.values} />
                            </ListItem>
                        </List>
                        <div className={styles.stepTitle}>
                            <h1>Dados do Administrador da Organização</h1>
                        </div>
                        <List className={styles.dataList}>
                            <ListItem>
                                <ListItemText
                                    primary='Nome completo do administrador'
                                    secondary={form.name}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary='Nome de usuário do administrador'
                                    secondary={form.user}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary='E-mail do administrador'
                                    secondary={form.email}
                                />
                            </ListItem>
                        </List>

                        <div className={styles.buttonWrapper}>
                                <Button
                                    variant='contained'
                                    size='large'
                                    onClick={handleBack}
                                    startIcon={<MI.ChevronLeft />}
                                >
                                    Voltar
                                </Button>  
                                <Button
                                    variant='contained'
                                    size='large'
                                    color='primary'
                                    onClick={onSubmitForm}
                                    endIcon={<MI.Save />}
                                >
                                    Finalizar
                                </Button>
                        </div>
                    </div>
                )
            }
        </div>
    );
}