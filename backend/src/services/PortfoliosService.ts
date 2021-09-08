import { getCustomRepository, Repository } from 'typeorm';
import { Organization } from '../entities/Organization';
import { Person } from '../entities/Person';
import { Portfolio } from '../entities/Portfolio';
import { OrganizationsRepository } from '../repositories/OrganizationsRepository';
import { PersonsRepository } from '../repositories/PersonsRepository';
import { PortfoliosRepository } from '../repositories/PortfoliosRepository';

class PortfoliosService {
    private portfoliosRepository: Repository<Portfolio>;
    private personsRepository: Repository<Person>;
    private organizationsRepository: Repository<Organization>;

    constructor() {
        this.portfoliosRepository = getCustomRepository(PortfoliosRepository);
        this.personsRepository = getCustomRepository(PersonsRepository);
        this.organizationsRepository = getCustomRepository(OrganizationsRepository);
    }

    async create(id_organization: number, id_person: number, description: string, objective: string ): Promise<Portfolio> {
        
        if(!id_organization || !id_person || !description || !objective) {
            throw new Error('Valores obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_organization)) {
            throw new Error('Organização inválida');
        }

        if (Number.isNaN(id_person)) {
            throw new Error('Pessoa inválida');
        }

        const organization = this.organizationsRepository.findOne({
            where: { id_organization},
        });

        if (!organization) {
            throw new Error('Organização não encontrada');
        }

        const person = this.personsRepository.findOne({
            where: { id_person},
        });

        if (!person) {
            throw new Error('Persona não encontrada');
        }

        const portfolio = this.portfoliosRepository.create({
            id_organization,
            id_person,
            description,
            objective,
        });

        const portfolioResponse = await this.portfoliosRepository.save(portfolio);

        return portfolioResponse;
    }

    async list(): Promise<Portfolio[]> {
        const list = await this.portfoliosRepository.find();

        if (list.length < 1) {
            throw new Error('Nenhum portfólio está cadastrado');
        }
        
        return list;
    }
    async findById(id_organization: number): Promise<Portfolio> {

        if (!id_organization) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_organization)) {
            throw new Error('Organização inválida');
        }

        const portfolio = await this.portfoliosRepository.findOne({
            where: {id_organization},
        });

        if(!portfolio) {
            throw new Error('Portfólio não existe');
        }

        return portfolio;
    }
}

export { PortfoliosService };