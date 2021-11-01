import { EntityRepository, Repository } from 'typeorm';
import { Person } from '../entities/Person';

@EntityRepository(Person)
class PersonsRepository extends Repository<Person> {}

export { PersonsRepository };
