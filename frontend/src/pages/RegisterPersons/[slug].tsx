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
    persona: number;
    oldPassword?: string;
}

export default function RegisterPersons(): JSX.Element{
    const { isAuthenticated, user } = useContext(AuthContext);
    const { idOrganization } = user;
    const router = useRouter();
    const { slug } = router.query;

    const personaTypes = [
        {
            label: 'Administrador',
            value: 1,
        },
        {
            label: 'Diretoria',
            value: 2,
        },
        {
            label: 'Gerente de portfólio',
            value: 3,
        },
        {
            label: 'Gerente de projeto',
            value: 4,
        },
    ];

    const startingForm = {
        name: '',
        user: '',
        email: '',
        persona: 3,
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
                persona: 3,
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
        const { user, name, email, persona } = form;

        setValue('user', user);
        setValue('name', name);
        setValue('email', email);
        setValue('persona', persona);

    }, [form]);

    async function onSubmit(data: UserForm) {
        const { email, password, name, user, persona } = data;
        setForm({
            email,
            name,
            user,
            persona,
            password: '',
            confirmPassword: '',
        });

        const requestData = {
            organizationId: idOrganization,
            personaId: persona,
            email,
            name,
            password,
            user
        };

        if (!isNaN(Number(slug)) && Number(slug) > -1) {
            alert('Pessoa cadastrada atualizada');
        } else {
            await api.post('persons', requestData);

            alert('Pessoa cadastrada com sucesso');
        }
        router.push('/ListPersons');
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
                                name='persona'
                                control={control}
                                defaultValue={3}
                                rules={{ required: 'Campo obrigatório' }}
                                render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                    <TextField
                                        select
                                        label='Tipo de usuário'
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
                                        {personaTypes.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </TextField>
                                ) }
                            />
                        </div>
                        {
                        Number(slug) > -1 && (
                            <div className={styles.field}>
                                <Controller 
                                name='oldPassword'
                                control={control}
                                defaultValue=''
                                rules={{
                                    validate: {
                                        required: value => {
                                            return (Number(slug) > -1 && value) || 'Campo Obrigatório';
                                        },
                                    }
                                }}
                                render={ ({ field: { onChange, onBlur, value} }) => (
                                    <TextField
                                        type='password'
                                        label='Senha atual do usuário'
                                        variant='outlined'
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        fullWidth
                                        value={value}
                                    />
                                ) }
                            />
                            </div>
                        )
                    }
                        <div className={styles.field}>
                            <Controller 
                                name='password'
                                control={control}
                                defaultValue=''
                                rules={{ 
                                    validate: {
                                        required: value => {
                                            return (Number(slug) === -1 && !!value) || 'Campo Obrigatório';
                                        },
                                        requireOldPassword: value => {
                                            const { oldPassword } = getValues();
                                            if (Number(slug) > -1) {
                                                if (!!value && !oldPassword){
                                                    return 'Insira a senha antiga do usuário antes de mudar para uma nova';
                                                }
                                            }
                                            return true;
                                        },
                                    }
                                }}
                                render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                    <TextField
                                        type='password'
                                        label={ Number(slug) > -1 ? 'Nova Senha' : 'Senha'}
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
                                    validate: { 
                                        isPasswordFilled: (value) => { 
                                            const { password } = getValues();
                                            return !!value && !!password || 'Confirme a nova senha';
                                        }, 
                                        isPasswordsMatches: (value) => { 
                                        const { password } = getValues();
                                        return password === value || 'Senhas devem ser iguais';
                                        }, 
                                    }
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