import { EntityRepository, Repository } from 'typeorm';
import { Unit } from '../entities/Unit';

@EntityRepository(Unit)
class UnitiesRepository extends Repository<Unit> {}

export { UnitiesRepository };
