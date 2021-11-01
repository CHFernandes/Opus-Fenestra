import { EntityRepository, Repository } from 'typeorm';
import { CustomizedGrade } from '../entities/CustomizedGrade';

@EntityRepository(CustomizedGrade)
class CustomizedGradesRepository extends Repository<CustomizedGrade> {}

export { CustomizedGradesRepository };
