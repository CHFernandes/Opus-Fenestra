import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import { Button, Step, Stepper, StepLabel, TextField, } from '@material-ui/core';
import { useForm, Controller, useFieldArray, useWatch, Control } from 'react-hook-form';
import * as MI from '@material-ui/icons/';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { api } from '../../services/api';

import styles from './styles.module.scss';
import toast from 'react-hot-toast';
import { AuthContext } from '../../contexts/AuthContext';

type Criterion = {
    criterionId: number;
    description: string;
    weight: number;
    unitDescription: string;
    bestValue: number;
    worstValue: number;
}

type Project = {
    projectId: number;
    name: string;
    description: string;
    plannedStartDate: string;
    plannedEndDate: string;
}

type EvaluationForm = {
    id: number;
    criterionId: number;
    insertedValue: number;
    realValue?: number;
    bestValue: number;
    worstValue: number;
    description: string;
    unitDescription: string;
    weight: number;
}

type EvaluationFormArray = {
    evaluation: EvaluationForm[];
}

function Total ({control}: { control: Control<EvaluationFormArray>}): JSX.Element {
    const fields = useWatch({ control, name: 'evaluation', defaultValue: []});
    const total = fields?.reduce((sum, field) => {
        const amount = Number(field.insertedValue) * Number(field.weight) / 10;
        if (!Number.isNaN(amount)) {
            sum += amount;
        }

        return sum;
    }, 0);

    return <p>Nota total: {total}</p>;
}

export default function RegisterOrganizationWizard(): JSX.Element {
    const { isAuthenticated, user } = useContext(AuthContext);
    const router = useRouter();
    const { slug } = router.query;
    const [criteriaArray, setCriteriaArray] = useState<Criterion[] | null >([]);
    const [projectsArray, setProjectsArray] = useState<Project[] | null >([]);
    const [activeStep, setActiveStep] = useState(0);
    const [isRendered, setIsRendered] = useState(false);
    const { handleSubmit, control} = useForm<EvaluationFormArray>({
        mode: 'all',
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'evaluation'
    });

    useEffect(() => {
        async function getPortfolio() {
            try {
                const { data } = await api.get(`/portfolios/${user.idOrganization}`);
                const portfolioId = data.id_portfolio;
                return portfolioId;
            } catch(error) {
                toast.error(error.response.data.message);
            }
        }

        async function getAllProjects() {
            try {
                const portfolioId = await getPortfolio();
                const { data } = await api.get(`/registeredProjects/${portfolioId}`);
                const projects = data.map((project) => {
                    return {
                        projectId: project.id_project,
                        name: project.name,
                        description: project.description,
                        plannedStartDate: format(new Date(project.planned_start_date), 'dd/MM/yyyy', {
                            locale: ptBR,
                        }),
                        plannedEndDate: format(new Date(project.planned_end_date), 'dd/MM/yyyy', {
                            locale: ptBR,
                        }),
                    };
                });
                setProjectsArray(projects);
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }

        async function getOnlyProject() {
            try {
                const { data } = await api.get(`/registeredProject/${slug}`);
                const project: Project = {
                    projectId: data.id_project,
                    name: data.name,
                    description: data.description,
                    plannedStartDate: format(new Date(data.planned_start_date), 'dd/MM/yyyy', {
                        locale: ptBR,
                    }),
                    plannedEndDate: format(new Date(data.planned_end_date), 'dd/MM/yyyy', {
                        locale: ptBR,
                    }),
                };
                setProjectsArray([project]);
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }

        async function getCriteria() {
            try {
                const portfolioId = await getPortfolio();
                const { data } = await api.get(`criteriaPortfolio/${portfolioId}`);
                const criteria = data.map((criterion) => {
                    return {
                        criterionId: criterion.id_criteria,
                        description: criterion.description,
                        weight: criterion.weight,
                        unitDescription: criterion.unit_description,
                        bestValue: criterion.best_manual_value,
                        worstValue: criterion.worst_manual_value,
                    };
                });

                const weightSum = criteria.reduce((sum, criterion) => {
                    const weight = Number(criterion.weight);
                    if (!Number.isNaN(weight)) {
                        sum += weight;
                    }
                    return sum;
                }, 0);

                if (weightSum !== 10) {
                    toast.error('Soma dos pesos está diferente de 10, não será possível prosseguir com a avaliação');
                    toast.error('Por favor atualize o peso de seus critérios');
                    router.push('/ListCriteria');
                    return;
                }

                setCriteriaArray(criteria);
                setIsRendered(true);
                remove();
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }

        if (!isAuthenticated) {
            router.push('/Login');
            return;
        }

        if (!isNaN(Number(slug)) && Number(slug) > -1) {
            getOnlyProject();
        } else {
            getAllProjects();
        }

        getCriteria();

    }, []);

    useEffect(() => {
        if(isRendered) {
            criteriaArray.map((criterion) => {
                const criteriaField = {
                    criterionId: criterion.criterionId,
                    insertedValue: criterion.worstValue,
                    bestValue: criterion.bestValue,
                    worstValue: criterion.worstValue,
                    description: criterion.description,
                    unitDescription: criterion.unitDescription,
                    weight: criterion.weight,
                    id: criterion.criterionId,
                };
                const fieldFound = fields.find(field => field.criterionId === criterion.criterionId);

                if (!fieldFound) {
                    append(criteriaField);
                }
            });
        }
    }, [fields, criteriaArray]);

    async function onSubmit(data: EvaluationFormArray) {
        try {
            const evaluations = data.evaluation.map(calculate);

            evaluations.forEach(async (evaluation) => {
                const evaluationObject = {
                    projectId: projectsArray[activeStep].projectId,
                    criteriaId: evaluation.criterionId,
                    evaluationDate: format(new Date(), 'yyyy-MM-dd', {
                        locale: ptBR,
                    }),
                    value: evaluation.realValue,
                };

                await api.post('evaluation', evaluationObject);
            });

            if (projectsArray.length -1 > activeStep) {
                remove();
                handleNext();
            } else {
                toast.success('Avaliação finalizada, redirecionando para a aprovação de projetos');
                router.push('/AcceptProjects');
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    function calculate(evaluation: EvaluationForm ) {
        evaluation.realValue = Number(evaluation.insertedValue) * Number(evaluation.weight) / 10;
        return evaluation;
    }

    function handleNext() {
        setActiveStep((previousActiveStep) => previousActiveStep + 1);
    }

    return(
        <div className={styles.wizardWrapper}>
            <Stepper className={styles.stepperWrapper} activeStep={activeStep} alternativeLabel>
                {projectsArray.map((project) => (
                    <Step key={project.projectId}>
                        <StepLabel>{project.name}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <form className={styles.formWrapper} onSubmit={handleSubmit(onSubmit)}>
                <fieldset>
                    <legend>
                        <h2>Avaliação</h2>
                    </legend>

                    { fields.map((field, index) => (
                        <div key={field.criterionId}>
                            <div className={styles.criterionWrapper}>
                                <div className={styles.criterionTitle}>
                                    <h3>{field.description}</h3>
                                </div>
                                <div className={styles.subTitle}>
                                    <h4>{field.unitDescription}</h4>
                                </div>
                                <div className={styles.subTitle}>
                                    <h4>Peso: {field.weight}</h4>
                                </div>
                                <div className={styles.formFields}>
                                    <div className={styles.field}>
                                        {/* 
                                            Este componente tem um problema de ir de estado não controlado para controlado
                                            o fix seria assinalar um valor padrão, porém o defaultValue espera um valor do 
                                            tipo never, ainda é desconhecido o que causa isso e como corrigir
                                        */}
                                        <Controller 
                                            name={`evaluation.${index}.insertedValue` as `evaluation.${number}.insertedValue`}
                                            control={control}
                                            rules={{ 
                                                required: 'Campo obrigatório',
                                                validate: {
                                                    isBiggerThanWorstValue: (value) => {
                                                        return field.worstValue <= value || `Valor minimo para este critério é: ${field.worstValue}`;
                                                    },
                                                    isSmallerThanBestValue: (value) => {
                                                        return field.bestValue >= value || `Valor máximo para este critério é: ${field.bestValue}`;
                                                    }
                                                }
                                            }}
                                            render={ ({ field: { onChange, onBlur, value}, fieldState: { error } }) => (
                                                <TextField
                                                    type='number'
                                                    label='Avaliação do critério'
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
                        </div>
                    ))}
                    <div className={styles.total}>
                        <Total control={control} />
                    </div>
                </fieldset>
                <div className={styles.buttonWrapper}>
                    <Button
                        variant='contained'
                        size='large'
                        color='primary'
                        type='submit'
                        endIcon={<MI.ChevronRight />}
                    >
                        {
                            projectsArray.length -1 > activeStep ? (
                                <span>Próximo</span>
                            ) : (
                                <span>Finalizar</span>
                            )
                        }
                    </Button>
                </div>
            </form>
        </div>
    );
}