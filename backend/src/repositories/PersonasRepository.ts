import { EntityRepository, Repository } from 'typeorm';
import { Persona } from '../entities/Persona';

@EntityRepository(Persona)
class PersonasRepository extends Repository<Persona> {}

export { PersonasRepository };
