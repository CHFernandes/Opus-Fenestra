import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import { Button, Fab, FormControlLabel, Step, StepLabel, Stepper, Switch, TextField } from '@material-ui/core';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import * as MI from '@material-ui/icons';

import { api } from '../../services/api';
import styles from './styles.module.scss';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';


type FormDataGeneral = { 
    id?: number;
    description: string;
    isValuesManual: boolean;
}

type FormDataCustomGrade = {
    id?: number;
    numericValue: number;
    description: string;
}

type RequestGrade = {
    id_customized_grades: number;
    description: string;
    numeric_value: number;
}

type FormDataCustomGradeArray = {
    grades: FormDataCustomGrade[];
}

export default function RegisterUnities(): JSX.Element {
    const { isAuthenticated } = useContext(AuthContext);
    const router = useRouter();
    const { slug } = router.query;

    const startingFormGeneral = {
        description: '',
        isValuesManual: true,
    };

    const steps = ['Dados Gerais da unidade', 'Dados Customizados da unidade'];

    const [formDataGeneral, setFormDataGeneral] = useState<FormDataGeneral>(startingFormGeneral);
    const [manualUnit, setManualUnit] = useState<boolean>(true);
    const [activeStep, setActiveStep] = useState(0);
    const [savedGrades, setSavedGrades] = useState<RequestGrade[]>([]);
    const { handleSubmit:handleSubmitGeneral, control:controlGeneral, setValue} = useForm<FormDataGeneral>({
        mode: 'all',
        defaultValues: startingFormGeneral,
    });
    const { handleSubmit, control} = useForm<FormDataCustomGradeArray>({
        mode: 'all',
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'grades'
    });

    useEffect(() => {
        async function getUnit() {
            const { data } = await api.get(`/unit/${slug}`);

            const generalForm = {
                id: data.id_unities,
                description: data.description,
                isValuesManual: data.is_values_manual,
            };

            setFormDataGeneral(generalForm);

            setManualUnit(data.is_values_manual);

            if (!data.is_values_manual && data.grades_list.length > 0) {
                const gradeList = data.grades_list;
                setSavedGrades(gradeList);
                gradeList.forEach((grade) => {
                    const gradeObject = {
                        id: grade.id_customized_grades,
                        numericValue: grade.numeric_value,
                        description: grade.description,
                    };
                    append(gradeObject);
                });
            }
        }

        if (!isAuthenticated) {
            router.push('/Login');
            return;
        }

        remove();

        if (!isNaN(Number(slug)) && Number(slug) > -1) {
            getUnit();
        }
    }, []);

    useEffect(() => {
        const { description, isValuesManual } = formDataGeneral;

        setValue('description', description);
        setValue('isValuesManual', isValuesManual);

    }, [formDataGeneral]);

    async function onSubmitGeneral(data: FormDataGeneral) {
        try {
            const { description } = data;

            const generalData: FormDataGeneral = {
                description,
                isValuesManual: manualUnit
            };

            if (manualUnit) {
                if (Number(slug) > -1) {
                    await api.put(`updateUnit/${Number(slug)}`, generalData);
                    toast.success('Unidade atualizada com sucesso');
                } else {
                    await api.post('unit', generalData);
                    toast.success('Unidade criada com sucesso');
                }
                router.push('/ListUnities');
            } else {
                setFormDataGeneral(generalData);
                handleNext();
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } 
    }

    async function onSubmitGrades(data: FormDataCustomGradeArray) {
        try {
            const { grades } = data;

            if(grades.length < 2) {
                toast.error('Erro, necessário dois valores para o valor máximo e o mínimo');
                return;
            }

            const zeroValue = grades.find((grade) => Number(grade.numericValue) === 0);
            const tenValue = grades.find((grade) => Number(grade.numericValue) === 10);

            if (!zeroValue || !tenValue) {
                toast.error('Erro, necessário ter uma nota com valor numérico 0 e outra com o valor numérico de 10');
                return;
            }

            if(Number(slug) > -1) {
                await api.put(`updateUnit/${Number(slug)}`, formDataGeneral);
                toast.success('Unidade atualizada com sucesso');

                const idUnit = Number(slug);

                const parsedGrades = grades.map((grade) => {
                    const returnGrade = {
                        id: grade.id,
                        description: grade.description,
                        numericValue: Number(grade.numericValue),
                    };
    
                    return returnGrade;
                });

                const currentSavedGrades = savedGrades.map((grade) => {
                    const returnGrade = {
                        id: grade.id_customized_grades,
                        description: grade.description,
                        numericValue: Number(grade.numeric_value),
                    };
    
                    return returnGrade;
                });

                const updatedValues = parsedGrades.filter((grade) => {
                    const foundGrade = currentSavedGrades.find((saved) => grade.id === saved.id);
                    if (foundGrade !== undefined) {
                        return true;
                    }
                    return false;
                });

                const newValues = parsedGrades.filter((grade) => {
                    const foundGrade = currentSavedGrades.find((saved) => grade.id === saved.id);
                    if (foundGrade !== undefined) {
                        return false;
                    }
                    return true;
                });
                
                const deletedValues = currentSavedGrades.filter((grade) => {
                    const foundGrade = parsedGrades.find((parsed) => grade.id === parsed.id);
                    if (foundGrade !== undefined) {
                        return false;
                    }
                    return true;
                });

                if (updatedValues.length > 0) {
                    for (let i = 0; i < updatedValues.length; i++) {
                        const updatedValue = updatedValues[i];
                        const gradeObject = {
                            idUnit,
                            description: updatedValue.description,
                            numericValue: updatedValue.numericValue,
                        };
                        await api.put(`customizedGrades/${updatedValue.id}`, gradeObject);
                    }
                }

                if (newValues.length > 0) {
                    for (let i = 0; i < newValues.length; i++) {
                        const newValue = newValues[i];
                        const gradeObject = {
                            idUnit,
                            description: newValue.description,
                            numericValue: newValue.numericValue,
                        };
                        await api.post('customizedGrades', gradeObject);
                    }
                }
                
                if (deletedValues.length > 0) {
                    for (let i = 0; i < deletedValues.length; i++) {
                        const deletedValue = deletedValues[i];
                        await api.delete(`customizedGrades/${deletedValue.id}`);
                    }
                }

                toast.success('Notas atualizadas');

                const { data } = await api.get(`/unit/${idUnit}`);

                const newSavedGrades = data.grades_list.map((grade) => {
                    const gradeObject = {
                        gradeId: grade.id_customized_grades,
                        numericValue: grade.numeric_value,
                        description: grade.description,
                    };
                    return gradeObject;
                });

                const bestGrade = newSavedGrades.reduce((prev, current) => {
                    return (prev.numericValue > current.numericValue) ? prev : current;
                });
    
                const worstGrade = newSavedGrades.reduce((prev, current) => {
                    return (prev.numericValue < current.numericValue) ? prev : current;
                });

                const setGradesRequest = {
                    bestValue: Number(bestGrade.gradeId),
                    worstValue: Number(worstGrade.gradeId)
                };
    
                await api.put(`unit/${idUnit}`, setGradesRequest);
                toast.success('Notas máximas e minimas configuradas');

            } else {
                const unit = await api.post('unit', formDataGeneral);
                toast.success('Unidade criada com sucesso');

                const idUnit = unit.data.id_unities;

                const parsedGrades = grades.map((grade) => {
                    const returnGrade = {
                        description: grade.description,
                        numericValue: Number(grade.numericValue),
                    };
    
                    return returnGrade;
                });

                const insertedGrades = await Promise.all(parsedGrades.map(async (grade) => {
                    const gradeObject = {
                        idUnit,
                        description: grade.description,
                        numericValue: grade.numericValue,
                    };
    
                    const insertedGrade = await api.post('customizedGrades', gradeObject);
    
                    const returnGrade = {
                        gradeId: insertedGrade.data.id_customized_grades,
                        numericValue: Number(insertedGrade.data.numeric_value)
                    };
    
                    return returnGrade;
                }));
    
                toast.success('Notas cadastradas com sucesso');
    
                const bestGrade = insertedGrades.reduce((prev, current) => {
                    return (prev.numericValue > current.numericValue) ? prev : current;
                });
    
                const worstGrade = insertedGrades.reduce((prev, current) => {
                    return (prev.numericValue < current.numericValue) ? prev : current;
                });
    
                const setGradesRequest = {
                    bestValue: Number(bestGrade.gradeId),
                    worstValue: Number(worstGrade.gradeId)
                };
    
                await api.put(`unit/${idUnit}`, setGradesRequest);
                toast.success('Notas máximas e minimas configuradas');
            }
            
            router.push('/ListUnities');
        } catch (error) {
            toast.error(error.response.data.message);
        } 
    }

    function onChangedManualUnit() {
        setManualUnit(!manualUnit);
    }

    function handleNext () {
        if (!manualUnit) {
            if(Number(slug) === -1) {
                append({});
                append({});
            }
            setActiveStep((previousActiveStep) => previousActiveStep + 1);
            return;
        }
    }

    function handleBack () {
        setActiveStep((previousActiveStep) => previousActiveStep - 1);
    }

    function addNewCustomGrade () {
        append({});
    }

    function removeItem(field, index: number) {
        remove(index);
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
                    <div className={styles.registerUnities}>
                        <form onSubmit={handleSubmitGeneral(onSubmitGeneral)}>
                            { 
                                Number(slug) > -1 ? (
                                    <h1>Atualização de Notas</h1>
                                ) : (
                                    <h1>Cadastro de Notas</h1>
                                )
                            }           

                            <fieldset>
                                <legend>
                                    <h2>Informações gerais</h2>
                                </legend>
                                
                                <div className={styles.field}>
                                    <Controller 
                                        name='description'
                                        control={controlGeneral}
                                        defaultValue=''
                                        rules={{ required: 'Campo obrigatório' }}
                                        render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                            <TextField
                                                type='text'
                                                label='Descrição da nota'
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
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={manualUnit}
                                                onChange={onChangedManualUnit}
                                                name='Valores manuais'
                                                color='primary'
                                            />
                                        }
                                        label='Valores manuais'
                                    />
                                </div>

                            </fieldset>
                            <div className={styles.buttonWrapper}>
                                { 
                                    manualUnit ? (
                                        <Button
                                            variant='contained'
                                            color='primary'
                                            size='large'
                                            startIcon={<MI.Save />}
                                            type='submit'
                                        >
                                            { 
                                                Number(slug) > -1 ? (
                                                    <span>Atualizar Unidade</span>
                                                ) : (
                                                    <span>Cadastrar Unidade</span>
                                                )
                                            }   
                                        </Button>
                                    ) : (
                                        <Button
                                            variant='contained'
                                            color='primary'
                                            size='large'
                                            startIcon={<MI.ChevronRight />}
                                            type='submit'
                                        >
                                            <span>Próximo </span>
                                        </Button>
                                    )
                                }
                            </div>
                        </form>
                    </div>
                )
            }
            {
                activeStep === 1 && (
                    <div className={styles.registerUnities}>
                        <div className={styles.buttonHeadbar}>
                            <Fab
                                size='medium' 
                                color='primary'
                                aria-label='add'
                                onClick={addNewCustomGrade}
                            >
                                <MI.Add />
                            </Fab>
                        </div>
                        <form onSubmit={handleSubmit(onSubmitGrades)}>
                            <fieldset>
                                <legend>
                                    <h2>Dados customizados</h2>
                                </legend>
                                { fields.map((field, index) => (
                                    <fieldset key={!field.id ? index : field.id} className={styles.fieldSets}>
                                        <div className={styles.field}>
                                            <Controller 
                                                name={`grades.${index}.description` as `grades.${number}.description`}
                                                control={control}
                                                rules={{ 
                                                    required: 'Campo obrigatório'
                                                }}
                                                render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                                    <TextField
                                                        type='text'
                                                        label='Descrição da nota'
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
                                                name={`grades.${index}.numericValue` as `grades.${number}.numericValue`}
                                                control={control}
                                                rules={{ 
                                                    required: 'Campo obrigatório',
                                                    validate: {
                                                        isBiggerThanZero: (value) => {
                                                            return 0 <= value || 'Valor minimo para esta unidade é: 0';
                                                        },
                                                        isSmallerThanTen: (value) => {
                                                            return 10 >= value || 'Valor máximo para esta unidade é: 10';
                                                        },
                                                    }
                                                }}
                                                render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                                    <TextField
                                                        type='number'
                                                        label='Valor Numérico da nota'
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
                                        <div className={styles.buttonWrapper}>
                                            <Button
                                                variant='contained'
                                                color='secondary'
                                                size='large'
                                                onClick={() => {removeItem(field, index);}}
                                            >
                                                <span>Remover</span>
                                            </Button>
                                        </div>
                                    </fieldset>
                                ))}
                            </fieldset>
                            <div className={styles.buttonWrapperSecondary}>
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
                                    endIcon={<MI.Save />}
                                    type='submit'
                                >
                                    Finalizar
                                </Button>
                            </div>
                        </form>
                    </div>
                )
            }
        </div>
    );
}
