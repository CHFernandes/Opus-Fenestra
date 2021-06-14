import { EntityRepository, Repository } from 'typeorm';
import { Criterion } from '../entities/Criterion';

@EntityRepository(Criterion)
class CriteriaRepository extends Repository<Criterion> {}

export {CriteriaRepository}