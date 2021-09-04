import { getCustomRepository, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
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

        const registeredEmail = await this.personsRepository.findOne({
            where: {email},
        });

        if (registeredEmail) {
            throw new Error('E-mail already registered');
        }

        const registeredPerson = await this.personsRepository.findOne({
            where: {user, id_organization},
        });

        if (registeredPerson) {
            throw new Error('Username already registered');
        }

        // password = await bcrypt.hash(password, 10);

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