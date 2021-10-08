import { EntityRepository, Repository } from 'typeorm';
import { ProjectStatus } from '../entities/ProjectStatus';

@EntityRepository(ProjectStatus)
class ProjectsStatusRepository extends Repository <ProjectStatus> {}

export{ProjectsStatusRepository};

