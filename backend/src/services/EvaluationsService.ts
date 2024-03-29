import { getConnection, getCustomRepository, Repository } from 'typeorm';
import { Criterion } from '../entities/Criterion';
import { Project } from '../entities/Project';
import { Evaluation } from '../entities/Evaluation';
import { CriteriaRepository } from '../repositories/CriteriaRepository';
import { ProjectsRepository } from '../repositories/ProjectsRepository';
import { EvaluationsRepository } from '../repositories/EvaluationsRepository';
import { Portfolio } from '../entities/Portfolio';
import { PortfoliosRepository } from '../repositories/PortfoliosRepository';
import { ProjectStatus } from '../entities/ProjectStatus';
import { ProjectsStatusRepository } from '../repositories/ProjectsStatusRepository';
import { Person } from '../entities/Person';
import { PersonsRepository } from '../repositories/PersonsRepository';

type RecentEvaluation = {
    id_project: number;
    evaluation_date: Date;
    id_portfolio: number;
    name: string;
    grade: number;
};

class EvaluationsService {
    private criteriaRepository: Repository<Criterion>;
    private projectsRepository: Repository<Project>;
    private evaluationsRepository: Repository<Evaluation>;
    private portfoliosRepository: Repository<Portfolio>;
    private projectsStatusRepository: Repository<ProjectStatus>;
    private personsRepository: Repository<Person>;

    constructor() {
        this.criteriaRepository = getCustomRepository(CriteriaRepository);
        this.projectsRepository = getCustomRepository(ProjectsRepository);
        this.evaluationsRepository = getCustomRepository(EvaluationsRepository);
        this.portfoliosRepository = getCustomRepository(PortfoliosRepository);
        this.projectsStatusRepository = getCustomRepository(
            ProjectsStatusRepository
        );
        this.personsRepository = getCustomRepository(PersonsRepository);
    }

    async evaluate(
        id_project: number,
        id_criteria: number,
        evaluation_date_string: string,
        value: number
    ): Promise<Evaluation> {
        if (
            !id_project ||
            !id_criteria ||
            !evaluation_date_string ||
            (value !== 0 && value == undefined)
        ) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_project)) {
            throw new Error('Projeto inválido');
        }

        const project = await this.projectsRepository.findOne({
            where: {
                id_project,
            },
        });

        if (!project) {
            throw new Error('Projeto não existe');
        }

        if (project.id_status !== 1) {
            throw new Error('Projeto com estado inválido para avaliação');
        }

        if (Number.isNaN(id_criteria)) {
            throw new Error('Critério inválido');
        }

        const criterion = await this.criteriaRepository.findOne({
            where: { id_criteria },
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
            value,
        });

        const evaluationResponse = await this.evaluationsRepository.save(
            evaluation
        );

        project.id_status = 2;

        await this.projectsRepository.save(project);

        return evaluationResponse;
    }

    async updateEvaluation(
        id_project: number,
        id_person: number
    ): Promise<ProjectStatus> {
        if (!id_project || !id_person) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_project)) {
            throw new Error('Projeto inválido');
        }

        const project = await this.projectsRepository.findOne({
            where: {
                id_project,
            },
        });

        if (!project) {
            throw new Error('Projeto não existe');
        }

        if (project.id_status !== 1) {
            throw new Error('Projeto com estado inválido para esta operação');
        }

        if (Number.isNaN(id_person)) {
            throw new Error('Pessoa inválida');
        }

        const person = await this.personsRepository.findOne({
            where: {
                id_person,
            },
        });

        if (!person) {
            throw new Error('Pessoa não existe');
        }

        const projectStatus = this.projectsStatusRepository.create({
            id_person,
            id_status: 2,
            id_project,
            changed_time: new Date(),
        });

        const updatedStatus = await this.projectsStatusRepository.save(
            projectStatus
        );

        return updatedStatus;
    }

    async getLastEvaluations(
        id_portfolio: number
    ): Promise<RecentEvaluation[]> {
        if (!id_portfolio) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_portfolio)) {
            throw new Error('Portfólio inválido');
        }

        const portfolio = await this.portfoliosRepository.findOne({
            where: { id_portfolio },
        });

        if (!portfolio) {
            throw new Error('Portfólio inexistente');
        }

        const list = await getConnection()
            .createQueryBuilder(Evaluation, 'evaluation')
            .select('evaluation.id_project', 'id_project')
            .addSelect('evaluation.evaluation_date', 'evaluation_date')
            .addSelect('sum(evaluation.value)', 'grade')
            .addSelect('project.id_portfolio', 'id_portfolio')
            .addSelect('project.name', 'name')
            .leftJoin(
                Project,
                'project',
                'evaluation.id_project = project.id_project'
            )
            .where('project.id_portfolio = :id_portfolio', { id_portfolio })
            .groupBy('evaluation.id_project, evaluation.evaluation_date')
            .orderBy('evaluation.evaluation_date', 'DESC')
            .limit(5)
            .getRawMany();

        return list;
    }
}

export { EvaluationsService };
