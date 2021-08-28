import { getCustomRepository, Repository } from 'typeorm';
import { Organization } from '../entities/Organization';
import { OrganizationsRepository } from '../repositories/OrganizationsRepository';

class OrganizationsService {
    private organizationsRepository: Repository<Organization>;

    constructor() {
        this.organizationsRepository = getCustomRepository(OrganizationsRepository);
    }

    async create(name: string, mission: string, values: string, vision: string ): Promise<Organization> {
        if(!name || !mission || !values || !vision) {
            throw new Error('Mandatory values not filled');
        }

        const organization = this.organizationsRepository.create({
            name,
            mission,
            values,
            vision,
        });

        const organizationResponse = await this.organizationsRepository.save(organization);

        return organizationResponse;
    }

    async list(): Promise<Organization[]> {
        const list = await this.organizationsRepository.find();
        return list;
    }
}

export { OrganizationsService };