import { getCustomRepository, Repository } from 'typeorm';
import { Organization } from '../entities/Organization';
import { OrganizationsRepository } from '../repositories/OrganizationsRepository';

class OrganizationsService {
    private organizationsRepository: Repository<Organization>;

    constructor() {
        this.organizationsRepository = getCustomRepository(
            OrganizationsRepository
        );
    }

    async create(
        name: string,
        mission: string,
        values: string,
        vision: string
    ): Promise<Organization> {
        if (!name || !mission || !values || !vision) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        const organization = this.organizationsRepository.create({
            name,
            mission,
            values,
            vision,
        });

        const organizationResponse = await this.organizationsRepository.save(
            organization
        );

        return organizationResponse;
    }

    async list(): Promise<Organization[]> {
        const list = await this.organizationsRepository.find();
        return list;
    }

    async findById(id_organization: number): Promise<Organization> {
        if (!id_organization) {
            throw new Error('Valores obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_organization)) {
            throw new Error('Organização inválida');
        }

        const organization = await this.organizationsRepository.findOne({
            where: { id_organization },
        });

        if (!organization) {
            throw new Error('Organização não exite');
        }

        return organization;
    }
}

export { OrganizationsService };
