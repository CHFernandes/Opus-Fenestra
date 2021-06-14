import { EntityRepository, Repository } from 'typeorm';
import { Project } from '../entities/Project';

@EntityRepository(Project)
class ProjectsRepository extends Repository<Project> {}

export { ProjectsRepository }