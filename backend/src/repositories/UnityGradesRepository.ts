import { EntityRepository, Repository } from 'typeorm';
import { UnityGrade } from '../entities/UnityGrade';

@EntityRepository(UnityGrade)
class UnityGradesRepository extends Repository<UnityGrade> {}

export {UnityGradesRepository};