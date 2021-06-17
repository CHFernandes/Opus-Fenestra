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

export default function RegisterCriteria() {
    const router = useRouter();
    const { slug } = router.query;

    const [formData, setFormData] = useState({
        description: '',
        weight: '',
        unityType: '',
        bestValue: '',
        worstValue: '',
    });

    const [errors, setErrors] = useState({
        weight: false,
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
        }

        if (!isNaN(Number(slug)) && Number(slug) > -1) {
            getCriterion();
        }
    }, []);

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        resetValidation();
        const { name, value } = event.target;
        handleValidation( name, value );
        setFormData({ ...formData, [name]: value});
    }

    async function handleSubmit(event: FormEvent){
        event.preventDefault();

        if (errors.weight) {
            return;
        }

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
            weight: false
        });
    }

    function handleValidation(field: string, data: string) {
        if(field === 'weight') {
            const weight = Number(data);
            if (weight < 0) {
                setErrors({
                    weight: true,
                });
            }
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
                            required
                            name='description'
                            type='text'
                            label='Descrição do critério'
                            variant='outlined'
                            onChange={handleInputChange}
                            fullWidth
                            value={formData.description}
                        />
                    </div>

                    <div className={styles.field}>
                        <TextField
                            required
                            error={!!errors.weight}
                            helperText={!!errors.weight ? 'Insira um peso válido acima de 0' : ''}
                            name='weight'
                            type='number'
                            label='Peso do critério na avaliação'
                            variant='outlined'
                            onChange={handleInputChange}
                            fullWidth
                            value={formData.weight}
                        />
                    </div>

                    <div className={styles.field}>
                        <TextField
                            required
                            name='unityType'
                            type='text'
                            label='Tipo de unidade'
                            variant='outlined'
                            onChange={handleInputChange}
                            fullWidth
                            value={formData.unityType}
                        />
                    </div>

                    <div className={styles.field}>
                        <TextField
                            required
                            name='bestValue'
                            type='number'
                            label='Valor Mais Esperado'
                            variant='outlined'
                            onChange={handleInputChange}
                            fullWidth
                            value={formData.bestValue}
                        />
                    </div>

                    <div className={styles.field}>
                        <TextField
                            required
                            name='worstValue'
                            type='number'
                            label='Valor Menos Esperado'
                            variant='outlined'
                            onChange={handleInputChange}
                            fullWidth
                            value={formData.worstValue}
                        />
                    </div>
                </fieldset>

                <Button
                    variant='contained'
                    color='primary'
                    size='large'
                    startIcon={<MI.Save />}
                    type="submit"
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
