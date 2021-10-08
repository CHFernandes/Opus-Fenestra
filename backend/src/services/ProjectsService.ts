import { getConnection, getCustomRepository, Repository } from 'typeorm';
import { Person } from '../entities/Person';
import { Portfolio } from '../entities/Portfolio';
import { Project } from '../entities/Project';
import { Status } from '../entities/Status';
import { Evaluation } from '../entities/Evaluation';
import { PersonsRepository } from '../repositories/PersonsRepository';
import { PortfoliosRepository } from '../repositories/PortfoliosRepository';
import { ProjectsRepository } from '../repositories/ProjectsRepository';
import { EvaluationsRepository } from '../repositories/EvaluationsRepository';
import { ProjectStatus } from '../entities/ProjectStatus';
import { ProjectsStatusRepository } from '../repositories/ProjectsStatusRepository';

type EvaluatedProject = {
    id_project: number;
    id_portfolio: number;
    description: string;
    name: string;
    planned_start_date: Date;
    planned_end_date: Date;
    grade: number;
}

type ProjectEvaluation = {
    id_project: number;
    evaluation_date: Date;
    finalGrade: number;
}

class ProjectsService {
    private projectsRepository: Repository<Project>;
    private portfoliosRepository: Repository<Portfolio>
    private personsRepository: Repository<Person>
    private evaluationsRepository: Repository<Evaluation>
    private projectsStatusRepository: Repository<ProjectStatus>
    

    constructor() {
        this.projectsRepository = getCustomRepository(ProjectsRepository);
        this.portfoliosRepository = getCustomRepository(PortfoliosRepository);
        this.personsRepository = getCustomRepository(PersonsRepository);
        this.evaluationsRepository = getCustomRepository(EvaluationsRepository);
        this.projectsStatusRepository = getCustomRepository(ProjectsStatusRepository);

    }

    async create(id_portfolio: number, submitter: number, name: string, description: string, plannedStartDateAsString: string, plannedEndDateAsString: string): Promise<Project> {
        if(!id_portfolio || !submitter || !description || !name || !plannedStartDateAsString || !plannedEndDateAsString) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_portfolio)) {
            throw new Error('Portfólio inválido');
        }

        if (Number.isNaN(submitter)) {
            throw new Error('Pessoa inválida');
        }

        if (isNaN(new Date(plannedStartDateAsString).getTime())) {
            throw new Error('Data inicial inválida');
        }

        if (isNaN(new Date(plannedEndDateAsString).getTime())) {
            throw new Error('Data final inválida');
        }

        const planned_start_date = new Date(plannedStartDateAsString);
        const planned_end_date = new Date(plannedEndDateAsString);
        const completion = 0;
        const id_status = 1;

        if(planned_start_date.getTime() > planned_end_date.getTime()) {
            throw new Error('Data final deve ser depois da data inicial');
        }

        const portfolio = await this.portfoliosRepository.findOne({
            where: {id_portfolio},
        });

        if(!portfolio) {
            throw new Error('Portfólio não existe');
        }

        const person = await this.personsRepository.findOne({
            where: {id_person: submitter},
        });

        if(!person) {
            throw new Error('Pessoa não existe');
        }

        const project = this.projectsRepository.create({
            id_status,
            id_portfolio,
            description,
            name,
            submitter,
            completion,
            planned_start_date,
            planned_end_date
        });

        const newProject = await this.projectsRepository.save(project);

        const projectStatus = this.projectsStatusRepository.create({

            id_person: submitter,
            id_status,
            id_project: newProject.id_project,
            changed_time: new Date()

        });

        await this.projectsStatusRepository.save(projectStatus);

        return project;
    }

    async list(id_portfolio: number): Promise<Project[]>{

        if(!id_portfolio) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_portfolio)) {
            throw new Error('Portfólio inválido');
        }

        const portfolio = await this.portfoliosRepository.findOne({
            where: {id_portfolio},
        });

        if(!portfolio) {
            throw new Error('Portfólio não existe');
        }

        const list = await getConnection()
        .createQueryBuilder(Project, 'project')
        .select('project.id_project', 'id_project')
        .addSelect('project.id_status', 'id_status')
        .addSelect('project.id_category', 'id_category')
        .addSelect('project.id_portfolio', 'id_portfolio')
        .addSelect('project.description', 'description')
        .addSelect('project.name', 'name')
        .addSelect('project.responsible', 'responsible')
        .addSelect('project.submitter', 'submitter')
        .addSelect('project.document', 'document')
        .addSelect('project.completion', 'completion')
        .addSelect('project.planned_start_date', 'planned_start_date')
        .addSelect('project.planned_end_date', 'planned_end_date')
        .addSelect('project.actual_start_date', 'actual_start_date')
        .addSelect('project.actual_end_date', 'actual_end_date')
        .addSelect('status.description', 'status_description')
        .leftJoin(Status, 'status', 'project.id_status = status.id_status')
        .where('project.id_portfolio = :id_portfolio', { id_portfolio })
        .getRawMany();

        return list;
    }

    async findById(id_project: number): Promise<Project> {

        if(!id_project) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_project)) {
            throw new Error('Portfólio inválido');
        }

        const project = await this.projectsRepository.findOne({
            where: {id_project},
        });

        if(!project) {
            throw new Error('Projeto não existe');
        }

        return project;
    }

    async updateById (id_project: number,  name: string, completionString: string, description: string, plannedStartDateAsString: string, plannedEndDateAsString: string, status?: number): Promise<Project>{

        if(!id_project || !description || !name || !plannedStartDateAsString || !plannedEndDateAsString) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if(!id_project) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_project)) {
            throw new Error('Projeto inválido');
        }

        const project = await this.projectsRepository.findOne({
            where: {id_project},
        });

        if (isNaN(new Date(plannedStartDateAsString).getTime())) {
            throw new Error('Data inicial inválida');
        }

        if (isNaN(new Date(plannedEndDateAsString).getTime())) {
            throw new Error('Data final inválida');
        }

        const planned_start_date = new Date(plannedStartDateAsString);
        const planned_end_date = new Date(plannedEndDateAsString);
        const completion = Number(completionString);

        if (!project) {
            throw new Error('Projeto não existe');
        }

        if(planned_start_date.getTime() > planned_end_date.getTime()) {
            throw new Error('Data final deve ser depois da data inicial');
        }

        if (completion < 0) {
            throw new Error('Completude deve ser positiva');
        }

        if(project.planned_start_date > project.planned_end_date) {
            throw new Error('Data final deve ser depois da data inicial');
        }

        project.name = name;
        project.description = description;
        project.completion = completion;
        project.planned_start_date = planned_start_date;
        project.planned_end_date = planned_end_date;

        if(status) {
            project.id_status = status;
        }

        const updatedProject = await this.projectsRepository.save(project);

        return updatedProject;
    }

    async deleteById (id_project: number): Promise<boolean> {
        if(!id_project) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_project)) {
            throw new Error('Projeto inválido');
        }

        const project = await this.projectsRepository.findOne({
            where: {id_project},
        });

        if (!project) {
            throw new Error('Projeto não existe');
        }

        await this.projectsRepository.delete(id_project);

        return true;
    }

    async findRegisteredProjects(id_portfolio: number): Promise<Project[]> {
        if(!id_portfolio) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_portfolio)) {
            throw new Error('Portfólio inválido');
        }

        const portfolio = await this.portfoliosRepository.findOne({
            where: {id_portfolio},
        });

        if(!portfolio) {
            throw new Error('Portfólio não existe');
        }

        const projectList = await this.projectsRepository.find({
            where: {
                id_portfolio,
                id_status: 1,
            }
        });

        return projectList;
    }

    async findRegisteredProject(id_project: number): Promise<Project> {
        if(!id_project) {
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

        return project;
    }

    async findEvaluatedProjects(id_portfolio: number): Promise<EvaluatedProject[]> {
        if(!id_portfolio) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_portfolio)) {
            throw new Error('Portfólio inválido');
        }

        const portfolio = await this.portfoliosRepository.findOne({
            where: {id_portfolio},
        });

        if(!portfolio) {
            throw new Error('Portfólio não existe');
        }

        const projectList = await this.projectsRepository.find({
            where: {
                id_portfolio,
                id_status: 2,
            }
        });

        // SELECT e1.id_project, e1.evaluation_date, sum(e1.value) as finalGrade 
        // from evaluation e1
        // join (
        // 	select id_project, Max(evaluation_date) as max_date
        // 		from evaluation e2
        // 		group by id_project
        // ) as e2 where e1.id_project = e2.id_project and e1.evaluation_date = e2.max_date
        // group by e1.id_project, e1.evaluation_date;
        // <- retorna as avaliações mais recentes do projeto

        const evaluatedProjectsList = await Promise.all(projectList.map(async (project) => {
            const {
                id_project,
                id_portfolio,
                description,
                name,
                planned_end_date,
                planned_start_date,
            } = project;

            const subquery = getConnection()
            .createQueryBuilder(Evaluation, 'e2')
            .select('id_project')
            .addSelect('max(evaluation_date)', 'max_date')
            .groupBy('id_project');

            const evaluation = await getConnection()
            .createQueryBuilder(Evaluation, 'e1')
            .select('e1.id_project', 'id_project')
            .addSelect('e1.evaluation_date', 'id_project')
            .addSelect('sum(value)', 'finalGrade')
            .leftJoin(`(${subquery.getQuery()})`, 'e2')
            .where('e1.id_project = e2.id_project')
            .andWhere('e1.evaluation_date = e2.max_date')
            .andWhere('e1.id_project = :id_project', { id_project })
            .getRawOne();

            const finalGrade = evaluation.finalGrade;

            const returnProject = {
                id_project,
                id_portfolio,
                description,
                name,
                planned_end_date,
                planned_start_date,
                grade: finalGrade,
            };

            return returnProject;
        }));

        return evaluatedProjectsList;
    }

    async findProjectEvaluations(id_project: number): Promise<ProjectEvaluation[]>{
        if(!id_project) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_project)) {
            throw new Error('Projeto inválido');
        }

        const project = await this.projectsRepository.findOne({
            where: {id_project},
        });

        if(!project) {
            throw new Error('Projeto não existe');
        }

        // SELECT id_project, evaluation_date, sum(value) as finalGrade from evaluation group by id_project, evaluation_date; <- retorna todas as avaliações do projeto

        const evaluations = await getConnection()
        .createQueryBuilder(Evaluation, 'evaluation')
        .select('id_project')
        .addSelect('evaluation_date')
        .addSelect('sum(value)', 'finalGrade')
        .where('id_project = :id_project', {id_project})
        .groupBy('id_project')
        .addGroupBy('evaluation_date')
        .getRawMany();

        return evaluations;
    }

    async findApprovedProjects(id_portfolio: number): Promise<Project[]> {
        if(!id_portfolio) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_portfolio)) {
            throw new Error('Portfólio inválido');
        }

        const portfolio = await this.portfoliosRepository.findOne({
            where: {id_portfolio},
        });

        if(!portfolio) {
            throw new Error('Portfólio não existe');
        }

        const projectList = await this.projectsRepository.find({
            where: {
                id_portfolio,
                id_status: 3,
            }
        });

        return projectList;
    }

    async findAskedProjects(id_portfolio: number): Promise<Project[]> {
        if(!id_portfolio) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_portfolio)) {
            throw new Error('Portfólio inválido');
        }

        const portfolio = await this.portfoliosRepository.findOne({
            where: {id_portfolio},
        });

        if(!portfolio) {
            throw new Error('Portfólio não existe');
        }

        const list = await getConnection()
        .createQueryBuilder(Project, 'project')
        .select('project.id_project', 'id_project')
        .addSelect('project.id_status', 'id_status')
        .addSelect('project.id_category', 'id_category')
        .addSelect('project.id_portfolio', 'id_portfolio')
        .addSelect('project.description', 'description')
        .addSelect('project.name', 'name')
        .addSelect('project.responsible', 'responsible')
        .addSelect('project.submitter', 'submitter_id')
        .addSelect('project.document', 'document')
        .addSelect('project.completion', 'completion')
        .addSelect('project.planned_start_date', 'planned_start_date')
        .addSelect('project.planned_end_date', 'planned_end_date')
        .addSelect('project.actual_start_date', 'actual_start_date')
        .addSelect('project.actual_end_date', 'actual_end_date')
        .addSelect('person.user', 'submitter')
        .leftJoin(Person, 'person', 'project.submitter = person.id_person')
        .where('project.id_portfolio = :id_portfolio', { id_portfolio })
        .andWhere('project.id_status = 6')
        .getRawMany();

        return list;
    }

    async findRunningProjects(id_portfolio: number): Promise<Project[]> {
        if(!id_portfolio) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_portfolio)) {
            throw new Error('Portfólio inválido');
        }

        const portfolio = await this.portfoliosRepository.findOne({
            where: {id_portfolio},
        });

        if(!portfolio) {
            throw new Error('Portfólio não existe');
        }

        const list = await getConnection()
        .createQueryBuilder(Project, 'project')
        .select('project.id_project', 'id_project')
        .addSelect('project.id_category', 'id_category')
        .addSelect('project.description', 'description')
        .addSelect('project.name', 'name')
        .addSelect('project.responsible', 'responsible_id')
        .addSelect('project.completion', 'completion')
        .addSelect('project.planned_start_date', 'planned_start_date')
        .addSelect('project.planned_end_date', 'planned_end_date')
        .addSelect('project.actual_start_date', 'actual_start_date')
        .addSelect('person.name', 'responsible')
        .leftJoin(Person, 'person', 'project.responsible = person.id_person')
        .where('project.id_portfolio = :id_portfolio', { id_portfolio })
        .andWhere('project.id_status = 4')
        .getRawMany();

        return list;
    }

    async askProjectMoreInformation(id_project: number, id_person: number): Promise<Project> {
        if(!id_project || !id_person) {
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

        if(project.id_status !== 2) {
            throw new Error('Projeto com estado inválido para esta operação');
        }

        project.id_status = 6;

        const updatedProject = await this.projectsRepository.save(project);

        const projectStatus = this.projectsStatusRepository.create({

            id_person,
            id_status: project.id_status,
            id_project: project.id_project,
            changed_time: new Date()

        });
        
        await this.projectsStatusRepository.save(projectStatus);

        return updatedProject;
    }

    async acceptProject(id_project: number, id_person: number): Promise<Project> {
        if(!id_project || !id_person) {
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

        if(project.id_status !== 2) {
            throw new Error('Projeto com estado inválido para esta operação');
        }

        project.id_status = 3;

        const updatedProject = await this.projectsRepository.save(project);

        const projectStatus = this.projectsStatusRepository.create({

            id_person,
            id_status: project.id_status,
            id_project: project.id_project,
            changed_time: new Date()

        });
        
        await this.projectsStatusRepository.save(projectStatus);

        return updatedProject;
    }

    async rejectProject(id_project: number, id_person: number): Promise<Project> {
        if(!id_project || !id_person) {
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

        if(project.id_status !== 2) {
            throw new Error('Projeto com estado inválido para esta operação');
        }

        project.id_status = 7;

        const updatedProject = await this.projectsRepository.save(project);

        const projectStatus = this.projectsStatusRepository.create({

            id_person,
            id_status: project.id_status,
            id_project: project.id_project,
            changed_time: new Date()

        });
        
        await this.projectsStatusRepository.save(projectStatus);

        return updatedProject;
    }

    async beginProject(id_project: number, id_person: number, id_update_person: number): Promise<Project> {
        if(!id_project || !id_person || !id_update_person) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_project)) {
            throw new Error('Projeto inválido');
        }

        if (Number.isNaN(id_person)) {
            throw new Error('Responsável inválido');
        }

        const project = await this.projectsRepository.findOne({
            where: {
                id_project
            },
        });

        if(!project) {
            throw new Error('Projeto não existe');
        }

        if(project.id_status !== 3) {
            throw new Error('Projeto com estado inválido para esta operação');
        }

        const person = await this.personsRepository.findOne({
            where: {id_person}
        });

        if(!person) {
            throw new Error('Pessoa não existe');
        }

        project.id_status = 4;
        project.responsible = id_person;
        project.actual_start_date = new Date();

        const updatedProject = await this.projectsRepository.save(project);

        const projectStatus = this.projectsStatusRepository.create({

            id_person: id_update_person,
            id_status: project.id_status,
            id_project: project.id_project,
            changed_time: new Date()

        });
        
        await this.projectsStatusRepository.save(projectStatus);

        return updatedProject;
    }

    async stopProject(id_project: number, id_person: number): Promise<Project> {
        if(!id_project || !id_person) {
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

        if(project.id_status !== 4) {
            throw new Error('Projeto com estado inválido para esta operação');
        }

        project.id_status = 8;

        const updatedProject = await this.projectsRepository.save(project);

        const projectStatus = this.projectsStatusRepository.create({

            id_person,
            id_status: project.id_status,
            id_project: project.id_project,
            changed_time: new Date()

        });
        
        await this.projectsStatusRepository.save(projectStatus);

        return updatedProject;
    }

    async restartProject(id_project: number, id_person: number): Promise<Project> {
        if(!id_project || !id_person) {
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

        if(project.id_status !== 8) {
            throw new Error('Projeto com estado inválido para esta operação');
        }

        project.id_status = 4;

        const updatedProject = await this.projectsRepository.save(project);

        const projectStatus = this.projectsStatusRepository.create({

            id_person,
            id_status: project.id_status,
            id_project: project.id_project,
            changed_time: new Date()

        });
        
        await this.projectsStatusRepository.save(projectStatus);

        return updatedProject;
    }

    async cancelProject(id_project: number, id_person: number): Promise<Project> {
        if(!id_project || !id_person) {
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

        if(project.id_status !== 8) {
            throw new Error('Projeto com estado inválido para esta operação');
        }

        project.id_status = 9;

        const updatedProject = await this.projectsRepository.save(project);

        const projectStatus = this.projectsStatusRepository.create({

            id_person,
            id_status: project.id_status,
            id_project: project.id_project,
            changed_time: new Date()

        });
        
        await this.projectsStatusRepository.save(projectStatus);

        return updatedProject;
    }

    async finishProject(id_project: number, id_person: number): Promise<Project> {
        if(!id_project || !id_person) {
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

        if(project.id_status !== 4) {
            throw new Error('Projeto com estado inválido para esta operação');
        }

        if(project.completion !== 100) {
            throw new Error('Para ser finalizado projeto precisa estar 100% completado');
        }

        project.id_status = 5;

        const updatedProject = await this.projectsRepository.save(project);

        const projectStatus = this.projectsStatusRepository.create({

            id_person,
            id_status: project.id_status,
            id_project: project.id_project,
            changed_time: new Date()

        });
        
        await this.projectsStatusRepository.save(projectStatus);

        return updatedProject;
    }

    async projectsInRisk(id_portfolio: number): Promise<Project[]> {
        if(!id_portfolio) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_portfolio)) {
            throw new Error('Portfólio inválido');
        }

        const portfolio = await this.portfoliosRepository.findOne({
            where: {id_portfolio},
        });

        if(!portfolio) {
            throw new Error('Portfólio não existe');
        }

        const list = await getConnection()
        .createQueryBuilder(Project, 'project')
        .select('project.id_project', 'id_project')
        .addSelect('project.id_category', 'id_category')
        .addSelect('project.description', 'description')
        .addSelect('project.name', 'name')
        .addSelect('project.responsible', 'responsible_id')
        .addSelect('project.completion', 'completion')
        .addSelect('project.planned_start_date', 'planned_start_date')
        .addSelect('project.planned_end_date', 'planned_end_date')
        .addSelect('project.actual_start_date', 'actual_start_date')
        .addSelect('person.name', 'responsible')
        .leftJoin(Person, 'person', 'project.responsible = person.id_person')
        .where('project.id_portfolio = :id_portfolio', { id_portfolio })
        .andWhere('project.id_status = 4')
        .getRawMany();

        const filteredList = list.filter((project) => {
            const today = new Date();

            const projectEndDate = new Date(project.planned_end_date);

            const months3 = new Date(projectEndDate);
            months3.setMonth(months3.getMonth() - 3);

            const months2 = new Date(projectEndDate);
            months2.setMonth(months2.getMonth() - 2);

            const months1 = new Date(projectEndDate);
            months1.setMonth(months1.getMonth() - 1);

            if(((today.getTime() > months3.getTime()) && (project.completion < 70))) {
                return project;
            }

            if(((today.getTime() > months2.getTime()) && (project.completion < 80))) {
                return project;
            }

            if(((today.getTime() > months1.getTime()) && (project.completion < 90))) {
                return project;
            }
        });

        return filteredList;
    }

    async overdueProjects(id_portfolio: number): Promise<Project[]> {
        if(!id_portfolio) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_portfolio)) {
            throw new Error('Portfólio inválido');
        }

        const portfolio = await this.portfoliosRepository.findOne({
            where: {id_portfolio},
        });

        if(!portfolio) {
            throw new Error('Portfólio não existe');
        }

        const list = await getConnection()
        .createQueryBuilder(Project, 'project')
        .select('project.id_project', 'id_project')
        .addSelect('project.id_category', 'id_category')
        .addSelect('project.description', 'description')
        .addSelect('project.name', 'name')
        .addSelect('project.responsible', 'responsible_id')
        .addSelect('project.completion', 'completion')
        .addSelect('project.planned_start_date', 'planned_start_date')
        .addSelect('project.planned_end_date', 'planned_end_date')
        .addSelect('project.actual_start_date', 'actual_start_date')
        .addSelect('person.name', 'responsible')
        .leftJoin(Person, 'person', 'project.responsible = person.id_person')
        .where('project.id_portfolio = :id_portfolio', { id_portfolio })
        .andWhere('project.id_status = 4')
        .getRawMany();

        const filteredList = list.filter((project) => {
            const today = new Date();

            const projectEndDate = new Date(project.planned_end_date);

            if(today.getTime() > projectEndDate.getTime()) {
                return project;
            }
        });

        return filteredList;
    }

    async stoppedProjects(id_portfolio: number): Promise<Project[]> {
        if(!id_portfolio) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_portfolio)) {
            throw new Error('Portfólio inválido');
        }

        const portfolio = await this.portfoliosRepository.findOne({
            where: {id_portfolio},
        });

        if(!portfolio) {
            throw new Error('Portfólio não existe');
        }

        const list = await getConnection()
        .createQueryBuilder(Project, 'project')
        .select('project.id_project', 'id_project')
        .addSelect('project.id_category', 'id_category')
        .addSelect('project.description', 'description')
        .addSelect('project.name', 'name')
        .addSelect('project.responsible', 'responsible_id')
        .addSelect('project.completion', 'completion')
        .addSelect('project.planned_start_date', 'planned_start_date')
        .addSelect('project.planned_end_date', 'planned_end_date')
        .addSelect('project.actual_start_date', 'actual_start_date')
        .addSelect('person.name', 'responsible')
        .leftJoin(Person, 'person', 'project.responsible = person.id_person')
        .where('project.id_portfolio = :id_portfolio', { id_portfolio })
        .andWhere('project.id_status = 8')
        .getRawMany();

        return list;
    }
}

export {ProjectsService};