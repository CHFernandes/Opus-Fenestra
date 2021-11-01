import { EntityRepository, Repository } from 'typeorm';
import { Evaluation } from '../entities/Evaluation';

@EntityRepository(Evaluation)
class EvaluationsRepository extends Repository<Evaluation> {}

export { EvaluationsRepository };
