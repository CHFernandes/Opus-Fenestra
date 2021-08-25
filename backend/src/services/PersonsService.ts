import { getCustomRepository, Repository } from 'typeorm';
import { Person } from '../entities/Person';
import { PersonsRepository } from '../repositories/PersonsRepository';

class PersonsService {
    private personsRepository: Repository<Person>;

    constructor() {
        this.personsRepository = getCustomRepository(PersonsRepository);
    }

    async create(id_organization: number, id_persona: number, email: string, name: string, password: string, user: string ): Promise<Person> {
        if(!id_organization || !id_persona || !email || !name || !password || !user) {
            throw new Error('Mandatory values not filled');
        }

        const person = this.personsRepository.create({
            id_organization,
            id_persona,
            email,
            name,
            password,
            user,
        });

        const personResponse = await this.personsRepository.save(person);

        personResponse.password = '';

        return personResponse;
    }

    async list(): Promise<Person[]> {
        const list = await this.personsRepository.find();
        return list;
    }
}

export { PersonsService };