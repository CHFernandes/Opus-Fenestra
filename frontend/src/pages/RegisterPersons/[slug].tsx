import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import { Button, TextField } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';

import { api } from '../../services/api';
import styles from './styles.module.scss';
import { AuthContext } from '../../contexts/AuthContext';

type UserForm = {
    id?: number;
    name: string;
    user: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterPersons(): JSX.Element{
    const { isAuthenticated } = useContext(AuthContext);
    const router = useRouter();
    const { slug } = router.query;

    const startingForm = {
        name: '',
        user: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    const [form, setForm] = useState<UserForm>(startingForm);

    const { handleSubmit, control, getValues, setValue} = useForm<UserForm>({
        mode: 'all',
        defaultValues: startingForm,
    });

    useEffect(() => {
        async function getPerson() {
            // const { data } = await api.get(`/person/${slug}`);
            // const dataParsed = data;
            // const person = {
            //     id: dataParsed.idPerson,
            //     name: dataParsed.name,
            //     user: dataParsed.user,
            //     email: dataParsed.email,
            //     password: '',
            //     confirmPassword: '',
            // };

            const person = {
                id: 1,
                name: 'Teste Testonious',
                user: 'usedUser',
                email: 'someEmail@go.to.die',
                password: '',
                confirmPassword: '',
            };

            setForm(person);
        }

        if (!isAuthenticated) {
            router.push('/Login');
            return;
        }

        if (!isNaN(Number(slug)) && Number(slug) > -1) {
            getPerson();
        }
    }, []);

    useEffect(() => {
        const { user, name, email } = form;

        setValue('user', user);
        setValue('name', name);
        setValue('email', email);

    }, [form]);

    function onSubmit(data: UserForm) {
        const { email, password, name, user } = data;
        setForm({
            email,
            name,
            user,
            password: '',
            confirmPassword: '',
        });

        console.log({ email, password, name, user });

        if (!isNaN(Number(slug)) && Number(slug) > -1) {
            alert('Pessoa cadastrada atualizada');
            return;
        }

        alert('Pessoa cadastrada com sucesso');
        return;
    }
    

    return(
        <div className={styles.registerPerson}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset>
                    <legend>
                        <h2>Pessoa</h2>
                    </legend>
                    <div className={styles.formFields}>
                        <div className={styles.field}>
                            <Controller 
                                name='name'
                                control={control}
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
                                control={control}
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
                                control={control}
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
                                control={control}
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
                                control={control}
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
                </fieldset> 
                <div className={styles.buttonWrapper}>
                        <Button
                            variant='contained'
                            size='large'
                            color='primary'
                            type='submit'
                        >
                            Próximo
                        </Button>
                </div>
            </form>
        </div>
    );
}