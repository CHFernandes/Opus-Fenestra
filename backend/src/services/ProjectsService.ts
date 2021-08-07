import { getCustomRepository, Repository } from 'typeorm';
import { Project } from '../entities/Project';
import { ProjectsRepository } from '../repositories/ProjectsRepository';

class ProjectsService {
    private projectsRepository: Repository<Project>;

    constructor() {
        this.projectsRepository = getCustomRepository(ProjectsRepository);
    }

    async create(name: string, description: string, plannedStartDateAsString: string, plannedEndDateAsString: string): Promise<Project> {
        const plannedStartDate = new Date(plannedStartDateAsString);
        const plannedEndDate = new Date(plannedEndDateAsString);
        const completion = 0;

        if(plannedStartDate.getTime() > plannedEndDate.getTime()) {
            throw new Error('Planned end date must be after planned start date');
        }

        if (completion < 0) {
            throw new Error('Completion must be positive');
        }

        const project = this.projectsRepository.create({
            name,
            description,
            completion,
            plannedStartDate,
            plannedEndDate
        });

        await this.projectsRepository.save(project);

        return project;
    }

    async list(): Promise<Project[]> {
        const list = await this.projectsRepository.find();
        return list;
    }

    async findById(idProject: number): Promise<Project> {
        const project = await this.projectsRepository.findOne({
            where: {idProject},
        });

        if(!project) {
            throw new Error('Project doesn\'t exist');
        }

        return project;
    }

    async updateById (idProject: number, name: string, completionString: string, description: string, plannedStartDateAsString: string, plannedEndDateAsString: string): Promise<Project>{
        const project = await this.projectsRepository.findOne({
            where: {idProject},
        });

        const plannedStartDate = new Date(plannedStartDateAsString);
        const plannedEndDate = new Date(plannedEndDateAsString);
        const completion = Number(completionString);

        if (!project) {
            throw new Error('Project doesn\'t exist');
        }

        if(plannedStartDate.getTime() > plannedEndDate.getTime()) {
            throw new Error('Planned end date must be after planned start date');
        }

        if (completion < 0) {
            throw new Error('Completion must be positive');
        }

        project.name = name;
        project.description = description;
        project.completion = completion;
        project.plannedStartDate = plannedStartDate;
        project.plannedEndDate = plannedEndDate;

        if(project.plannedStartDate > project.plannedEndDate) {
            throw new Error('Planned end date must be after planned start date');
        }

        const updatedCriterion = await this.projectsRepository.save(project);

        return updatedCriterion;
    }

    async deleteById (idProject: number): Promise<boolean> {
        const criterion = await this.projectsRepository.findOne({
            where: {idProject},
        });

        if (!criterion) {
            throw new Error('Project doesn\'t exist');
        }

        await this.projectsRepository.delete(idProject);

        return true;
    }
}

export {ProjectsService};