import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import { Button, TextField } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';

import { api } from '../../services/api';
import styles from './styles.module.scss';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

type UserForm = {
    id?: number;
    name: string;
    user: string;
    email: string;
    password: string;
    confirmPassword: string;
    persona: number;
    oldPassword?: string;
};

type RequestData = {
    organizationId: number;
    personaId: number;
    email: string;
    name: string;
    user: string;
    password: string;
    oldPassword?: string;
};

export default function RegisterPersons(): JSX.Element {
    const { isAuthenticated, user } = useContext(AuthContext);
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

    const { handleSubmit, control, getValues, setValue } = useForm<UserForm>({
        mode: 'all',
        defaultValues: startingForm,
    });

    useEffect(() => {
        async function getPerson() {
            const { data } = await api.get(`/persons/${slug}`);
            const dataParsed = data;
            const person = {
                id: dataParsed.id_person,
                name: dataParsed.name,
                user: dataParsed.user,
                email: dataParsed.email,
                persona: dataParsed.id_persona,
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
        const { idOrganization } = user;
        const {
            email,
            password,
            name,
            user: userName,
            persona,
            oldPassword,
        } = data;

        setForm({
            email,
            name,
            user: userName,
            persona,
            password: '',
            confirmPassword: '',
        });

        const requestData: RequestData = {
            organizationId: idOrganization,
            personaId: persona,
            email,
            name,
            password,
            user: userName,
        };

        try {
            if (!isNaN(Number(slug)) && Number(slug) > -1) {
                requestData.oldPassword = oldPassword;
                await api.put(`persons/${Number(slug)}`, requestData);
                toast.success('Pessoa atualizada com sucesso');
            } else {
                await api.post('persons', requestData);

                toast.success('Pessoa cadastrada com sucesso');
            }
            router.push('/ListPersons');
            return;
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            }
        }
    }

    return (
        <div className={styles.registerPerson}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset>
                    <legend>
                        <h2>Usuário</h2>
                    </legend>
                    <div className={styles.formFields}>
                        <div className={styles.field}>
                            <Controller
                                name='name'
                                control={control}
                                defaultValue=''
                                rules={{ required: 'Campo obrigatório' }}
                                render={({
                                    field: { onChange, onBlur, value },
                                    fieldState: { error },
                                }) => (
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
                                )}
                            />
                        </div>
                        <div className={styles.field}>
                            <Controller
                                name='user'
                                control={control}
                                defaultValue=''
                                rules={{ required: 'Campo obrigatório' }}
                                render={({
                                    field: { onChange, onBlur, value },
                                    fieldState: { error },
                                }) => (
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
                                )}
                            />
                        </div>
                        <div className={styles.field}>
                            <Controller
                                name='email'
                                control={control}
                                defaultValue=''
                                rules={{
                                    required: 'Campo obrigatório',
                                    validate: {
                                        isEmailValid: (value) => {
                                            // validação de email por regex
                                            // eslint-disable-next-line no-useless-escape
                                            const regex =
                                                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                            return (
                                                regex.test(value) ||
                                                'Insira um e-mail valido'
                                            );
                                        },
                                    },
                                }}
                                render={({
                                    field: { onChange, onBlur, value },
                                    fieldState: { error },
                                }) => (
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
                                )}
                            />
                        </div>
                        <div className={styles.field}>
                            <Controller
                                name='persona'
                                control={control}
                                defaultValue={3}
                                rules={{ required: 'Campo obrigatório' }}
                                render={({
                                    field: { onChange, onBlur, value },
                                    fieldState: { error },
                                }) => (
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
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </div>
                        {Number(slug) > -1 && (
                            <div className={styles.field}>
                                <Controller
                                    name='oldPassword'
                                    control={control}
                                    defaultValue=''
                                    rules={{
                                        validate: {
                                            required: (value) => {
                                                return (
                                                    (Number(slug) > -1 &&
                                                        !!value) ||
                                                    'Campo Obrigatório'
                                                );
                                            },
                                        },
                                    }}
                                    render={({
                                        field: { onChange, onBlur, value },
                                        fieldState: { error },
                                    }) => (
                                        <TextField
                                            type='password'
                                            label='Senha atual do usuário'
                                            variant='outlined'
                                            onBlur={onBlur}
                                            onChange={onChange}
                                            fullWidth
                                            value={value}
                                            error={!!error}
                                            helperText={error && error.message}
                                        />
                                    )}
                                />
                            </div>
                        )}
                        <div className={styles.field}>
                            <Controller
                                name='password'
                                control={control}
                                defaultValue=''
                                rules={{
                                    validate: {
                                        required: (value) => {
                                            if (Number(slug) === -1) {
                                                if (!value) {
                                                    return 'Campo Obrigatório';
                                                }
                                            }
                                            return true;
                                        },
                                        requireOldPassword: (value) => {
                                            const { oldPassword } = getValues();
                                            if (Number(slug) > -1) {
                                                if (!!value && !oldPassword) {
                                                    return 'Insira a senha antiga do usuário antes de mudar para uma nova';
                                                }
                                            }
                                            return true;
                                        },
                                    },
                                }}
                                render={({
                                    field: { onChange, onBlur, value },
                                    fieldState: { error },
                                }) => (
                                    <TextField
                                        type='password'
                                        label={
                                            Number(slug) > -1
                                                ? 'Nova Senha'
                                                : 'Senha'
                                        }
                                        variant='outlined'
                                        onBlur={onBlur}
                                        onChange={onChange}
                                        fullWidth
                                        value={value}
                                        error={!!error}
                                        helperText={error && error.message}
                                    />
                                )}
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
                                            if (password) {
                                                if (!value) {
                                                    return 'Confirme a nova senha';
                                                }
                                            }
                                            return true;
                                        },
                                        isPasswordsMatches: (value) => {
                                            const { password } = getValues();
                                            return (
                                                password === value ||
                                                'Senhas devem ser iguais'
                                            );
                                        },
                                    },
                                }}
                                render={({
                                    field: { onChange, onBlur, value },
                                    fieldState: { error },
                                }) => (
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
                                )}
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
                        {Number(slug) > -1 ? (
                            <span>Atualizar Usuário</span>
                        ) : (
                            <span>Cadastrar Usuário</span>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
