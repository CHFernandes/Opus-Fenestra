import { getConnection, getCustomRepository, Repository } from 'typeorm';
// import bcrypt from 'bcrypt';
import { Person } from '../entities/Person';
import { PersonsRepository } from '../repositories/PersonsRepository';
import { Persona } from '../entities/Persona';
import { OrganizationsRepository } from '../repositories/OrganizationsRepository';
import { PersonasRepository } from '../repositories/PersonasRepository';
import { Organization } from '../entities/Organization';

class PersonsService {
    private personsRepository: Repository<Person>;
    private organizationsRepository: Repository<Organization>;
    private personasRepository: Repository<Persona>;

    constructor() {
        this.personsRepository = getCustomRepository(PersonsRepository);
        this.organizationsRepository = getCustomRepository(OrganizationsRepository);
        this.personasRepository = getCustomRepository(PersonasRepository);
    }

    async create(id_organization: number, id_persona: number, email: string, name: string, password: string, user: string ): Promise<Person> {
        if(!id_organization || !id_persona || !email || !name || !password || !user) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_organization)) {
            throw new Error('Organização inválida');
        }

        if (Number.isNaN(id_persona)) {
            throw new Error('Persona inválida');
        }

        // validação de email por regex
        // eslint-disable-next-line no-useless-escape
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;                          
        if (!regex.test(email)) {
            throw new Error('Insira um e-mail valido');
        }

        const organization = await this.organizationsRepository.findOne({
            where: { id_organization},
        });

        if (!organization) {
            throw new Error('Organização não encontrada');
        }

        const persona = await this.personasRepository.findOne({
            where: { id_persona},
        });

        if (!persona) {
            throw new Error('Persona não encontrada');
        }

        const registeredEmail = await this.personsRepository.findOne({
            where: {email},
        });

        if (registeredEmail) {
            throw new Error('E-mail já foi registrado');
        }

        const registeredPerson = await this.personsRepository.findOne({
            where: {user},
        });

        if (registeredPerson) {
            throw new Error('Usuário já foi registrado');
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

        if (!id_organization) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_organization)) {
            throw new Error('Organização inválida');
        }

        const organization = await this.organizationsRepository.findOne({
            where: { id_organization},
        });

        if (!organization) {
            throw new Error('Organização não encontrada');
        }

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

        if (list.length < 1) {
            throw new Error('Nenhuma pessoa está cadastrada');
        }

        return list;
    }

    async findById(id_person: number): Promise<Person> {

        if (!id_person) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_person)) {
            throw new Error('Pessoa inválida');
        }

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

        if (!person) {
            throw new Error('Pessoa não encontrada');
        }

        return person;
    }

    async updateById(id_person: number, id_organization: number, id_persona: number, email: string, name: string, user: string, oldPassword: string, password?: string): Promise<Person>{

        if(!id_person || !id_organization || !id_persona || !email || !name || !oldPassword || !user) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_person)) {
            throw new Error('Pessoa inválida');
        }

        if (Number.isNaN(id_organization)) {
            throw new Error('Organização inválida');
        }

        if (Number.isNaN(id_persona)) {
            throw new Error('Persona inválida');
        }

        // validação de email por regex
        // eslint-disable-next-line no-useless-escape
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;                          
        if (!regex.test(email)) {
            throw new Error('Insira um e-mail valido');
        }

        const organization = await this.organizationsRepository.findOne({
            where: { id_organization},
        });

        if (!organization) {
            throw new Error('Organização não encontrada');
        }

        const persona = await this.personasRepository.findOne({
            where: { id_persona},
        });

        if (!persona) {
            throw new Error('Persona não encontrada');
        }

        const registeredEmail = await this.personsRepository.findOne({
            where: {email},
        });

        if (registeredEmail && registeredEmail.id_person !== id_person) {
            throw new Error('E-mail já existe');
        }

        const registeredPerson = await this.personsRepository.findOne({
            where: {user},
        });

        if (registeredPerson && registeredPerson.id_person !== id_person) {
            throw new Error('Usuário já existe');
        }

        const person = await this.personsRepository.findOne({
            where: {id_person},
        });

        if (person.password !== oldPassword) {
            throw new Error('Senha incorreta');
        }

        if (oldPassword === password) {
            throw new Error('Insira uma nova senha');
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

        if (!id_person) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_person)) {
            throw new Error('Pessoa inválida');
        }

        const person = await this.personsRepository.findOne({
            where: {id_person},
        });

        if (!person) {
            throw new Error('Pessoa não existe');
        }

        await this.personsRepository.delete(id_person);

        return true;
    }
}

export { PersonsService };