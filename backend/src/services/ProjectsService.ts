import { getConnection, getCustomRepository, Repository } from 'typeorm';
import { Project } from '../entities/Project';
import { Status } from '../entities/Status';
import { ProjectsRepository } from '../repositories/ProjectsRepository';

class ProjectsService {
    private projectsRepository: Repository<Project>;

    constructor() {
        this.projectsRepository = getCustomRepository(ProjectsRepository);
    }

    async create(id_portfolio: number, submitter: number, name: string, description: string, plannedStartDateAsString: string, plannedEndDateAsString: string): Promise<Project> {

        if(!id_portfolio || !submitter || !description || !name || !plannedStartDateAsString || !plannedEndDateAsString) {
            throw new Error('Mandatory values not filled');
        }

        const planned_start_date = new Date(plannedStartDateAsString);
        const planned_end_date = new Date(plannedEndDateAsString);
        const completion = 0;
        const id_status = 1;

        if(planned_start_date.getTime() > planned_end_date.getTime()) {
            throw new Error('Planned end date must be after planned start date');
        }

        if (completion < 0) {
            throw new Error('Completion must be positive');
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

        await this.projectsRepository.save(project);

        return project;
    }

    async list(id_portfolio: number): Promise<Project[]>{

        if(!id_portfolio) {
            throw new Error('Mandatory values not filled');
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

        // const list = await this.projectsRepository.find(
        //     {where: {id_portfolio},}
        // );
        return list;
    }

    async findById(id_project: number): Promise<Project> {
        const project = await this.projectsRepository.findOne({
            where: {id_project},
        });

        if(!project) {
            throw new Error('Project doesn\'t exist');
        }

        return project;
    }

    async updateById (id_project: number,  name: string, completionString: string, description: string, plannedStartDateAsString: string, plannedEndDateAsString: string): Promise<Project>{

        if(!id_project || !description || !name || !plannedStartDateAsString || !plannedEndDateAsString) {
            throw new Error('Mandatory values not filled');
        }

        const project = await this.projectsRepository.findOne({
            where: {id_project},
        });

        const planned_start_date = new Date(plannedStartDateAsString);
        const planned_end_date = new Date(plannedEndDateAsString);
        const completion = Number(completionString);

        if (!project) {
            throw new Error('Project doesn\'t exist');
        }

        if(planned_start_date.getTime() > planned_end_date.getTime()) {
            throw new Error('Planned end date must be after planned start date');
        }

        if (completion < 0) {
            throw new Error('Completion must be positive');
        }

        if(project.planned_start_date > project.planned_end_date) {
            throw new Error('Planned end date must be after planned start date');
        }

        project.name = name;
        project.description = description;
        project.completion = completion;
        project.planned_start_date = planned_start_date;
        project.planned_end_date = planned_end_date;

        const updatedProject = await this.projectsRepository.save(project);

        return updatedProject;
    }

    async deleteById (id_project: number): Promise<boolean> {
        const project = await this.projectsRepository.findOne({
            where: {id_project},
        });

        if (!project) {
            throw new Error('Project doesn\'t exist');
        }

        await this.projectsRepository.delete(id_project);

        return true;
    }
}

export {ProjectsService};