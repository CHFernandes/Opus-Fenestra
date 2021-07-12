import { getCustomRepository, Repository } from 'typeorm';
import { Criterion } from '../entities/Criterion';
import { CriteriaRepository } from '../repositories/CriteriaRepository';

class CriteriaService {
    private criteriaRepository: Repository<Criterion>;

    constructor() {
        this.criteriaRepository = getCustomRepository(CriteriaRepository);
    }

    async create(description: string, weight: number, unityType: string, bestValue: number, worstValue: number): Promise<Criterion> {
        const criterion = this.criteriaRepository.create({
            description,
            weight,
            unityType,
            bestValue,
            worstValue
        });

        await this.criteriaRepository.save(criterion);

        return criterion;
    }

    async list(): Promise<Criterion[]> {
        const list = await this.criteriaRepository.find();
        return list;
    }

    async findById(idCriteria: number): Promise<Criterion> {
        const criterion = await this.criteriaRepository.findOne({
            where: {idCriteria},
        });

        if(!criterion) {
            throw new Error('Criterion doesn\'t exist');
        }

        return criterion;
    }

    async updateById (idCriteria: number, description: string, weight: number, unityType: string, bestValue: number, worstValue: number): Promise<Criterion> {
        const criterion = await this.criteriaRepository.findOne({
            where: {idCriteria},
        });

        if (!criterion) {
            throw new Error('Criterion doesn\'t exist');
        }

        criterion.description = description;
        criterion.weight = weight;
        criterion.unityType = unityType;
        criterion.bestValue = bestValue;
        criterion.worstValue = worstValue;

        const updatedCriterion = await this.criteriaRepository.save(criterion);

        return updatedCriterion;
    }

    async deleteById (idCriteria: number): Promise<Criterion[]> {
        const criterion = await this.criteriaRepository.findOne({
            where: {idCriteria},
        });

        if (!criterion) {
            throw new Error('Criterion doesn\'t exist');
        }

        await this.criteriaRepository.delete(idCriteria);

        const list = await this.criteriaRepository.find();
        return list;
    }
}

export { CriteriaService };