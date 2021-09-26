import { getCustomRepository, Repository } from 'typeorm';
import { Criterion } from '../entities/Criterion';
import { Project } from '../entities/Project';
import { Evaluation } from '../entities/Evaluation';
import { CriteriaRepository } from '../repositories/CriteriaRepository';
import { ProjectsRepository } from '../repositories/ProjectsRepository'; 
import { EvaluationsRepository } from '../repositories/EvaluationsRepository'; 

class EvaluationsService {
    private criteriaRepository: Repository<Criterion>;
    private projectsRepository: Repository<Project>;
    private evaluationsRepository: Repository<Evaluation>;

    constructor() {
        this.criteriaRepository = getCustomRepository(CriteriaRepository);
        this.projectsRepository = getCustomRepository(ProjectsRepository);
        this.evaluationsRepository = getCustomRepository(EvaluationsRepository);
    }

    async evaluate(id_project: number, id_criteria: number, evaluation_date_string: string, value: number): Promise<Evaluation> {
        if(!id_project || !id_criteria || !evaluation_date_string || !value) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_project)) {
            throw new Error('Projeto inválido');
        }

        const project = await this.projectsRepository.findOne({
            where: {
                id_project
            },
        });

        if(!project) {
            throw new Error('Projeto não existe');
        }

        if(project.id_status !== 1) {
            throw new Error('Projeto com estado inválido para avaliação');
        }

        if (Number.isNaN(id_criteria)) {
            throw new Error('Critério inválido');
        }

        const criterion = await this.criteriaRepository.findOne({
            where: {id_criteria},
        });

        if (!criterion) {
            throw new Error('Critério não existe');
        }

        if (Number.isNaN(value)) {
            throw new Error('Nota da avaliação inválida');
        }

        if (isNaN(new Date(evaluation_date_string).getTime())) {
            throw new Error('Data de avaliação inválida');
        }

        const evaluation_date = new Date(evaluation_date_string);

        const evaluation = this.evaluationsRepository.create({
            id_project,
            id_criteria,
            evaluation_date,
            value
        });

        const evaluationResponse = await this.evaluationsRepository.save(evaluation);

        project.id_status = 2;

        await this.projectsRepository.save(project);

        return evaluationResponse;
    }
}

export { EvaluationsService };