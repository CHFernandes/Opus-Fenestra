import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

import { Button, TextField } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';

import styles from './styles.module.scss';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

type LoginForm = {
    username: string;
    password: string;
}

export default function Login(): JSX.Element {
    const router = useRouter();
    const { handleSubmit, control } = useForm<LoginForm>({mode: 'all'});
    const { signIn, isAuthenticated } = useContext(AuthContext);

    async function onSubmit(data: LoginForm) {
        try {
            await signIn(data);
            router.push('/Dashboard');
        } catch (error) {
            toast.error(error.response.data.message);
        } 
    }

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/Dashboard');
            return;
        }
    }, []);

    return(
        <div className={styles.loginWrapper}>
            <div className={styles.headerWrapper}>
                <div className={styles.logoImage}>
                    <Image
                        width={250} 
                        height={250} 
                        src='/logo.svg'
                        alt='Opus fenestra'
                    />
                </div>
                <div>
                    <h1>Seja bem-vindo ao Opus Fenestra!</h1>
                    <h3>Realize o login para acessar a plataforma</h3>
                </div>
            </div>
            <div className={styles.formWrapper}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.field}>
                        <Controller 
                            name='username'
                            control={control}
                            defaultValue=''
                            rules={{ required: 'Campo obrigatório' }}
                            render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                <TextField
                                    type='text'
                                    label='Usuário'
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

                    <Button
                        variant='contained'
                        color='primary'
                        size='large'
                        type='submit'
                    >
                        { <span>Entrar</span> }   
                    </Button>
                </form>
            </div>
            <div className={styles.footerWrapper}>
                <Link href='/RegisterOrganizationWizard'>
                    <a>Sua empresa não tem uma conta? Crie aqui!</a>
                </Link>
            </div>
        </div>
    );
}