import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Button, TextField } from '@material-ui/core';
import * as MI from '@material-ui/icons';

import { api } from '../../services/api';
import styles from './styles.module.scss';


type FormData = {
    id?: number;
    description: string;
    weight: number;
    unityType: string;
    bestValue: number;
    worstValue: number;
}

export default function RegisterCriteria(): JSX.Element {
    const router = useRouter();
    const { slug } = router.query;

    const [formData, setFormData] = useState({
        description: '',
        weight: '',
        unityType: '',
        bestValue: '',
        worstValue: '',
    });

    const [valid, setValid] = useState(true);

    const [errors, setErrors] = useState({
        description: {
            valid: true,
            message: '',
        },
        weight: {
            valid: true,
            message: '',
        },
        unityType: {
            valid: true,
            message: '',
        },
        bestValue: {
            valid: true,
            message: '',
        },
        worstValue: {
            valid: true,
            message: '',
        },
    });

    useEffect(() => {
        async function getCriterion() {
            const { data } = await api.get(`/criteria/${slug}`);
            const dataParsed = data;
            const criterion = {
                id: dataParsed.idCriteria,
                description: dataParsed.description,
                weight: dataParsed.weight,
                unityType: dataParsed.unityType,
                bestValue: dataParsed.bestValue,
                worstValue: dataParsed.worstValue,
            };
            setFormData(criterion);
            resetValidation();
        }

        if (!isNaN(Number(slug)) && Number(slug) > -1) {
            getCriterion();
        }
    }, []);

    useEffect(() => {
        if (errors.description.valid &&
            errors.weight.valid &&
            errors.unityType.valid &&
            errors.bestValue.valid &&
            errors.worstValue.valid) {
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

    function handleSubmit(event: FormEvent){
        event.preventDefault();

        handleLazyValidation();

        if (!!formData.description && !!formData.weight && !!formData.unityType && !!formData.bestValue && !!formData.worstValue) {
            handlePost();
        }
    }

    function handleLazyValidation () {
        if (!formData.description) {
            setErrors(previousErrors => ({
                ...previousErrors,
                description: {valid: false, message:'Obrigatório'
            }}));
        }
        if (!formData.weight) {
            setErrors(previousErrors => ({
                ...previousErrors,
                weight: {valid: false, message:'Obrigatório'
            }}));
        }
        if (!formData.unityType) {
            setErrors(previousErrors => ({
                ...previousErrors,
                unityType: {valid: false, message:'Obrigatório'
            }}));
        }
        if (!formData.bestValue) {
            setErrors(previousErrors => ({
                ...previousErrors,
                bestValue: {valid: false, message:'Obrigatório'
            }}));
        }
        if (!formData.worstValue) {
            setErrors(previousErrors => ({
                ...previousErrors,
                worstValue: {valid: false, message:'Obrigatório'
            }}));
        }
    }
    async function handlePost() {
        const { description, weight, unityType, bestValue, worstValue } = formData;

        const data: FormData = {
            description: description,
            weight: Number(weight),
            unityType: unityType,
            bestValue: Number(bestValue),
            worstValue: Number(worstValue)
        };

        try {
            if (Number(slug) > -1) {
                await api.put(`criteria/${slug}`, data);

                alert('Critério atualizado com sucesso');
                router.push('/ListCriteria');
            } else {
                await api.post('criteria', data);

                alert('Critério criado com sucesso');
                router.push('/ListCriteria');
            }
        } catch (err) {
            alert(err.message);
        }
    }

    function resetValidation() {
        setErrors({
            description: {
                valid: true,
                message: '',
            },
            weight: {
                valid: true,
                message: '',
            },
            unityType: {
                valid: true,
                message: '',
            },
            bestValue: {
                valid: true,
                message: '',
            },
            worstValue: {
                valid: true,
                message: '',
            },
        });
    }

    function handleValidation(field: string, data: string ) {
        if(field === 'description'){
            if (!data) {
                setErrors({...errors, description: {valid: false, message:'Obrigatório'}});
                return;
            }
            setErrors({...errors, description: {valid: true, message:''}});
            return;
        }

        if(field === 'weight') {
            if (!data) {
                setErrors({...errors, weight: {valid: false, message:'Obrigatório'}});
                return;
            }

            const weight = Number(data);

            if (weight < 1) {
                setErrors({...errors, weight: {valid: false, message:'Insira um número válido acima de 0'}});
                return;
            }
            setErrors({...errors, weight: {valid: true, message:''}});
            return;
        }

        if(field === 'unityType'){
            if (!data) {
                setErrors({...errors, unityType: {valid: false, message:'Obrigatório'}});
                return;
            }
            setErrors({...errors, unityType: {valid: true, message:''}});
            return;
        }

        if(field === 'bestValue'){
            if (!data) {
                setErrors({...errors, bestValue: {valid: false, message:'Obrigatório'}});
                return;
            }
            setErrors({...errors, bestValue: {valid: true, message:''}});
            return;
        }

        if(field === 'worstValue'){
            if (!data) {
                setErrors({...errors, worstValue: {valid: false, message:'Obrigatório'}});
                return;
            }
            setErrors({...errors, worstValue: {valid: true, message:''}});
            return;
        }
    }
    return (
        <div className={styles.registerCriteria}>
            <form onSubmit={handleSubmit}>
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
                        <TextField
                            name='description'
                            type='text'
                            label='Descrição do critério'
                            variant='outlined'
                            onChange={handleInputChange}
                            fullWidth
                            value={formData.description}
                            error={!errors.description.valid}
                            helperText={!errors.description.valid && errors.description.message}
                        />
                    </div>

                    <div className={styles.field}>
                        <TextField
                            name='weight'
                            type='number'
                            label='Peso do critério na avaliação'
                            variant='outlined'
                            onChange={handleInputChange}
                            fullWidth
                            value={formData.weight}
                            error={!errors.weight.valid}
                            helperText={!errors.weight.valid && errors.weight.message}
                        />
                    </div>

                    <div className={styles.field}>
                        <TextField
                            name='unityType'
                            type='text'
                            label='Tipo de unidade'
                            variant='outlined'
                            onChange={handleInputChange}
                            fullWidth
                            value={formData.unityType}
                            error={!errors.unityType.valid}
                            helperText={!errors.unityType.valid && errors.unityType.message}
                        />
                    </div>

                    <div className={styles.field}>
                        <TextField
                            name='bestValue'
                            type='number'
                            label='Valor Mais Esperado'
                            variant='outlined'
                            onChange={handleInputChange}
                            fullWidth
                            value={formData.bestValue}
                            error={!errors.bestValue.valid}
                            helperText={!errors.bestValue.valid && errors.bestValue.message}
                        />
                    </div>

                    <div className={styles.field}>
                        <TextField
                            name='worstValue'
                            type='number'
                            label='Valor Menos Esperado'
                            variant='outlined'
                            onChange={handleInputChange}
                            fullWidth
                            value={formData.worstValue}
                            error={!errors.worstValue.valid}
                            helperText={!errors.worstValue.valid && errors.worstValue.message}
                        />
                    </div>
                </fieldset>

                <Button
                    variant='contained'
                    color='primary'
                    size='large'
                    startIcon={<MI.Save />}
                    type="submit"
                    disabled={!valid}
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
