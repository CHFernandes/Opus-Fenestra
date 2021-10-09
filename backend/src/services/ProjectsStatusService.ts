import { getConnection, getCustomRepository, Repository } from 'typeorm';
import { ProjectStatus } from '../entities/ProjectStatus';
import { Person } from '../entities/Person';
import { Portfolio } from '../entities/Portfolio';
import { Project } from '../entities/Project';
import { Status } from '../entities/Status';
import { ProjectsStatusRepository } from '../repositories/ProjectsStatusRepository';
import { PortfoliosRepository } from '../repositories/PortfoliosRepository';
import { ProjectsRepository } from '../repositories/ProjectsRepository';

class ProjectsStatusService {
    private portfoliosRepository: Repository<Portfolio>
    private projectsStatusRepository: Repository<ProjectStatus>
    private projectsRepository: Repository<Project>

    constructor() {
        this.portfoliosRepository = getCustomRepository(PortfoliosRepository);
        this.projectsStatusRepository = getCustomRepository(ProjectsStatusRepository);
        this.projectsRepository = getCustomRepository(ProjectsRepository);
    }

    async findLastProjectChangedStatus(id_portfolio: number): Promise<ProjectStatus[]> {
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
        .createQueryBuilder(ProjectStatus, 'project_status')
        .select('project_status.id_project_status', 'id_project_status')
        .addSelect('project_status.id_person', 'id_person')
        .addSelect('project_status.id_project', 'id_project')
        .addSelect('project_status.id_status', 'id_status')
        .addSelect('project_status.changed_time', 'changed_time')
        .addSelect('person.name', 'person_name')
        .addSelect('project.name', 'project_name')
        .addSelect('status.description', 'status_name')
        .leftJoin(Person, 'person', 'person.id_person = project_status.id_person')
        .leftJoin(Project, 'project', 'project.id_project = project_status.id_project')
        .leftJoin(Status, 'status', 'status.id_status = project_status.id_status')
        .where('project.id_portfolio = :id_portfolio', { id_portfolio })
        .orderBy('project_status.changed_time', 'DESC')
        .limit(5)
        .getRawMany();

        return list;
    }

    async findLastProjectChangedStatusByProject(id_project: number): Promise<ProjectStatus[]> {
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

        const list = await getConnection()
        .createQueryBuilder(ProjectStatus, 'project_status')
        .select('project_status.id_project_status', 'id_project_status')
        .addSelect('project_status.id_person', 'id_person')
        .addSelect('project_status.id_project', 'id_project')
        .addSelect('project_status.id_status', 'id_status')
        .addSelect('project_status.changed_time', 'changed_time')
        .addSelect('person.name', 'person_name')
        .addSelect('project.name', 'project_name')
        .addSelect('status.description', 'status_name')
        .leftJoin(Person, 'person', 'person.id_person = project_status.id_person')
        .leftJoin(Project, 'project', 'project.id_project = project_status.id_project')
        .leftJoin(Status, 'status', 'status.id_status = project_status.id_status')
        .where('project_status.id_project = :id_project', { id_project })
        .orderBy('project_status.changed_time', 'DESC')
        .getRawMany();

        return list;
    }
}

export {ProjectsStatusService};