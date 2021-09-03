import { getConnection, getCustomRepository, Repository } from 'typeorm';
import { Criterion } from '../entities/Criterion';
import { Unit } from '../entities/Unit';
import { CriteriaRepository } from '../repositories/CriteriaRepository';

class CriteriaService {
    private criteriaRepository: Repository<Criterion>;

    constructor() {
        this.criteriaRepository = getCustomRepository(CriteriaRepository);
    }

    async create(description: string, weight: number, id_portfolio: number, id_unities: number): Promise<Criterion> {
        if(!description || !weight || !id_portfolio || !id_unities) {
            throw new Error('Mandatory values not filled');
        }

        const criterion = this.criteriaRepository.create({
            id_portfolio,
            description,
            weight,
            id_unities,
        });

        await this.criteriaRepository.save(criterion);

        return criterion;
    }

    async list(id_portfolio: number): Promise<Criterion[]> {
        //const list = await this.criteriaRepository.find();

        if(!id_portfolio) {
            throw new Error('Mandatory values not filled');
        }

        const list = await getConnection()
                        .createQueryBuilder(Criterion, 'criteria')
                        .select('criteria.id_criteria', 'id_criteria')
                        .addSelect('criteria.id_portfolio', 'id_portfolio')
                        .addSelect('criteria.description', 'description')
                        .addSelect('criteria.weight', 'weight')
                        .addSelect('criteria.id_unities', 'id_unities')
                        .addSelect('unities.description', 'unit_description')
                        .addSelect('unities.is_values_manual', 'is_values_manual')
                        .addSelect('unities.best_manual_value', 'best_manual_value')
                        .addSelect('unities.worst_manual_value', 'worst_manual_value')
                        .leftJoin(Unit, 'unities', 'criteria.id_unities = unities.id_unities')
                        .where('criteria.id_portfolio = :id_portfolio', { id_portfolio })
                        .getRawMany();
        return list;
    }

    async findById(id_criteria: number): Promise<Criterion> {
        if(!id_criteria) {
            throw new Error('Mandatory values not filled');
        }

        // const criterion = await this.criteriaRepository.findOne({
        //     where: {id_criteria},
        // });

        const criterion = await getConnection()
                        .createQueryBuilder(Criterion, 'criteria')
                        .select('criteria.id_criteria', 'id_criteria')
                        .addSelect('criteria.id_portfolio', 'id_portfolio')
                        .addSelect('criteria.description', 'description')
                        .addSelect('criteria.weight', 'weight')
                        .addSelect('criteria.id_unities', 'id_unities')
                        .addSelect('unities.description', 'unit_description')
                        .addSelect('unities.is_values_manual', 'is_values_manual')
                        .addSelect('unities.best_manual_value', 'best_value')
                        .addSelect('unities.worst_manual_value', 'worst_value')
                        .leftJoin(Unit, 'unities', 'criteria.id_unities = unities.id_unities')
                        .where('criteria.id_criteria = :id_criteria', { id_criteria })
                        .getRawOne();

        if(!criterion) {
            throw new Error('Criterion doesn\'t exist');
        }

        return criterion;
    }

    async updateById (description: string, weight: number, id_portfolio: number, id_unities: number, id_criteria: number): Promise<Criterion> {
        if(!description || !weight || !id_portfolio || !id_unities || !id_criteria) {
            throw new Error('Mandatory values not filled');
        }

        const criterion = await this.criteriaRepository.findOne({
            where: {id_criteria},
        });

        if (!criterion) {
            throw new Error('Criterion doesn\'t exist');
        }

        criterion.description = description;
        criterion.weight = weight;
        criterion.id_portfolio = id_portfolio;
        criterion.id_unities = id_unities;

        const updatedCriterion = await this.criteriaRepository.save(criterion);

        return updatedCriterion;
    }

    async deleteById (id_criteria: number): Promise<boolean> {
        const criterion = await this.criteriaRepository.findOne({
            where: {id_criteria},
        });

        if (!criterion) {
            throw new Error('Criterion doesn\'t exist');
        }

        await this.criteriaRepository.delete(id_criteria);

        return true;
    }
}

export { CriteriaService };