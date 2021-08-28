import { getCustomRepository, Repository } from 'typeorm';
import { Portfolio } from '../entities/Portfolio';
import { PortfoliosRepository } from '../repositories/PortfoliosRepository';

class PortfoliosService {
    private portfoliosRepository: Repository<Portfolio>;

    constructor() {
        this.portfoliosRepository = getCustomRepository(PortfoliosRepository);
    }

    async create(id_organization: number, id_person: number, description: string, objective: string ): Promise<Portfolio> {
        if(!id_organization || !id_person || !description || !objective) {
            throw new Error('Mandatory values not filled');
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
        return list;
    }
}

export { PortfoliosService };