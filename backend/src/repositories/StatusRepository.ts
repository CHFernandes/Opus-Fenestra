import { EntityRepository, Repository } from 'typeorm';
import { Status } from '../entities/Status';

@EntityRepository(Status)
class StatusRepository extends Repository<Status> {}

export { StatusRepository };
