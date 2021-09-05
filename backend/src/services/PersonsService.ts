import { getConnection, getCustomRepository, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { Person } from '../entities/Person';
import { PersonsRepository } from '../repositories/PersonsRepository';
import { Persona } from '../entities/Persona';

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

    async list(id_organization: number): Promise<Person[]> {
        const list = await getConnection()
                            .createQueryBuilder(Person, 'person')
                            .select('person.id_person', 'id_person')
                            .addSelect('person.id_persona', 'id_persona')
                            .addSelect('person.id_organization', 'id_organization')
                            .addSelect('person.name', 'name')
                            .addSelect('person.user', 'user')
                            .addSelect('person.email', 'email')
                            .addSelect('persona.type_persona', 'type_persona')
                            .leftJoin(Persona, 'persona', 'person.id_persona = persona.id_persona')
                            .where('person.id_organization = :id_organization', { id_organization})
                            .getRawMany();
        return list;
    }

    async findById(id_person: number): Promise<Person> {
        const person = await getConnection()
        .createQueryBuilder(Person, 'person')
        .select('person.id_person', 'id_person')
        .addSelect('person.id_persona', 'id_persona')
        .addSelect('person.id_organization', 'id_organization')
        .addSelect('person.name', 'name')
        .addSelect('person.user', 'user')
        .addSelect('person.email', 'email')
        .addSelect('persona.type_persona', 'type_persona')
        .leftJoin(Persona, 'persona', 'person.id_persona = persona.id_persona')
        .where('person.id_person = :id_person', { id_person})
        .getRawOne();

        return person;
    }

    async updateById(id_person: number, id_organization: number, id_persona: number, email: string, name: string, user: string, oldPassword: string, password?: string): Promise<Person>{

        const registeredEmail = await this.personsRepository.findOne({
            where: {email},
        });

        if (registeredEmail && registeredEmail.id_person !== id_person) {
            throw new Error('E-mail already registered');
        }

        const registeredPerson = await this.personsRepository.findOne({
            where: {user, id_organization},
        });

        if (registeredPerson && registeredPerson.id_person !== id_person) {
            throw new Error('Username already registered');
        }

        const person = await this.personsRepository.findOne({
            where: {id_person},
        });

        if (person.password !== oldPassword) {
            throw new Error('Password doesn\'t match');
        }

        if (oldPassword === password) {
            throw new Error('Insert a new password');
        }

        person.name = name;
        person.email = email;
        person.user = user;
        person.id_persona = id_persona;

        if (password) {
            person.password = password;
        }

        const updatedPerson = await this.personsRepository.save(person);

        return updatedPerson;
    }

    async deleteById(id_person: number): Promise<boolean> {
        const person = await this.personsRepository.findOne({
            where: {id_person},
        });

        if (!person) {
            throw new Error('Person doesn\'t exist');
        }

        await this.personsRepository.delete(id_person);

        return true;
    }
}

export { PersonsService };