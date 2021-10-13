import { getConnection, getCustomRepository, Repository } from 'typeorm';
import { Criterion } from '../entities/Criterion';
import { CustomizedGrade } from '../entities/CustomizedGrade';
import { Portfolio } from '../entities/Portfolio';
import { Unit } from '../entities/Unit';
import { UnityGrade } from '../entities/UnityGrade';
import { CriteriaRepository } from '../repositories/CriteriaRepository';
import { CustomizedGradesRepository } from '../repositories/CustomizedGradesRepository';
import { PortfoliosRepository } from '../repositories/PortfoliosRepository';
import { UnitiesRepository } from '../repositories/UnitiesRepository';

type CriteriaListing = {
    id_criteria: number;
    id_portfolio: number;
    description: string;
    weight: number;
    id_unities: number;
    unit_description: string;
    is_values_manual: boolean;
    grade_list?: CustomizedGrade[];
    best_value?: number | string;
    worst_value?: number | string;
}

class CriteriaService {
    private criteriaRepository: Repository<Criterion>;
    private portfoliosRepository: Repository<Portfolio>;
    private unitiesRepository: Repository<Unit>;
    private customizedGradesRepository: Repository<CustomizedGrade>;

    constructor() {
        this.criteriaRepository = getCustomRepository(CriteriaRepository);
        this.portfoliosRepository = getCustomRepository(PortfoliosRepository);
        this.unitiesRepository = getCustomRepository(UnitiesRepository);
        this.customizedGradesRepository = getCustomRepository(CustomizedGradesRepository);
    }

    async create(description: string, weight: number, id_portfolio: number, id_unities: number): Promise<Criterion> {
        if(!description || !weight || !id_portfolio || !id_unities) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(weight) || weight < 1) {
            throw new Error('Peso com valor inválido');
        }

        if (Number.isNaN(id_portfolio)) {
            throw new Error('Portfolio inválido');
        }

        if (Number.isNaN(id_unities)) {
            throw new Error('Unidades inválidas');
        }

        const portfolio = await this.portfoliosRepository.findOne({
            where: { id_portfolio},
        });

        if (!portfolio) {
            throw new Error('Portfólio não encontrado');
        }

        const unit = await this.unitiesRepository.findOne({
            where: { id_unities},
        });

        if (!unit) {
            throw new Error('Unidade não encontrada');
        }

        const criteriaArray = await this.criteriaRepository.find({
            where: {
                id_portfolio
            }
        });

        const totalWeight = criteriaArray.reduce((sum, criterion) => {
            const weight = Number(criterion.weight);
            if (!Number.isNaN(weight)) {
                sum += weight;
            }
            return sum;
        }, 0);

        if(Number(totalWeight) + Number(weight) > 10) {
            throw new Error('Soma dos pesos dos critérios maior que 10, operação será abortada');
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

    async list(id_portfolio: number): Promise<CriteriaListing[]> {

        if(!id_portfolio) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_portfolio)) {
            throw new Error('Portfolio inválido');
        }

        const portfolio = await this.portfoliosRepository.findOne({
            where: { id_portfolio},
        });

        if (!portfolio) {
            throw new Error('Portfólio não encontrado');
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
        .addSelect('unities.best_values', 'best_values_id')
        .addSelect('unities.worst_values', 'worst_values_id')
        .leftJoin(Unit, 'unities', 'criteria.id_unities = unities.id_unities')
        .where('criteria.id_portfolio = :id_portfolio', { id_portfolio })
        .getRawMany();

        const parsedList = Promise.all(list.map(async (criterion) => {
            const {
                id_criteria,
                id_portfolio,
                description,
                weight,
                id_unities,
                unit_description,
                is_values_manual,
                best_manual_value,
                worst_manual_value,
                best_values_id,
                worst_values_id
            } = criterion;

            const returnObject: CriteriaListing = {
                id_criteria,
                id_portfolio,
                description,
                weight,
                id_unities,
                unit_description,
                is_values_manual,
            };

            if(is_values_manual) {
                returnObject.best_value = best_manual_value;
                returnObject.worst_value = worst_manual_value;
                returnObject.grade_list = [];
                return returnObject;
            }

            const bestUnit = await this.customizedGradesRepository.findOne({
                where: {
                    id_customized_grades: best_values_id,
                }
            });

            const worstUnit = await this.customizedGradesRepository.findOne({
                where: {
                    id_customized_grades: worst_values_id,
                }
            });

            returnObject.best_value = bestUnit.description;
            returnObject.worst_value = worstUnit.description;

            const gradeList = await getConnection()
            .createQueryBuilder(CustomizedGrade, 'cg')
            .select('cg.id_customized_grades', 'id_customized_grades')
            .addSelect('cg.numeric_value', 'numeric_value')
            .addSelect('cg.description', 'description')
            .leftJoin(UnityGrade, 'ug')
            .where('ug.id_customized_grades = cg.id_customized_grades')
            .andWhere('ug.id_unities = :id_unities', { id_unities })
            .orderBy('cg.numeric_value', 'DESC')
            .getRawMany();

            returnObject.grade_list = gradeList;

            return returnObject;
        }));

        return parsedList;
    }

    async findById(id_criteria: number): Promise<Criterion> {
        if(!id_criteria) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_criteria)) {
            throw new Error('Critério inválido');
        }

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
            throw new Error('Critério não existe');
        }

        return criterion;
    }

    async updateById (description: string, weight: number, id_portfolio: number, id_unities: number, id_criteria: number): Promise<Criterion> {
        if(!description || !weight || !id_portfolio || !id_unities || !id_criteria) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(weight) || weight < 1) {
            throw new Error('Peso com valor inválido');
        }

        if (Number.isNaN(id_portfolio)) {
            throw new Error('Portfolio inválido');
        }

        if (Number.isNaN(id_unities)) {
            throw new Error('Unidades inválidas');
        }

        if (Number.isNaN(id_criteria)) {
            throw new Error('Critério inválido');
        }

        const portfolio = await this.portfoliosRepository.findOne({
            where: { id_portfolio},
        });

        if (!portfolio) {
            throw new Error('Portfólio não encontrado');
        }

        const unit = await this.unitiesRepository.findOne({
            where: { id_unities},
        });

        if (!unit) {
            throw new Error('Unidade não encontrada');
        }

        const criterion = await this.criteriaRepository.findOne({
            where: {id_criteria, id_portfolio},
        });

        if (!criterion) {
            throw new Error('Critério não existe');
        }

        const criteriaArray = await this.criteriaRepository.find({
            where: {
                id_portfolio
            }
        });

        const totalWeight = criteriaArray.reduce((sum, criterion) => {
            const weight = Number(criterion.weight);
            if (!Number.isNaN(weight)) {
                sum += weight;
            }
            return sum;
        }, 0);

        if(Number(totalWeight) + Number(weight) - Number(criterion.weight) > 10) {
            throw new Error('Soma dos pesos dos critérios maior que 10, operação será abortada');
        }

        criterion.description = description;
        criterion.weight = weight;
        criterion.id_unities = id_unities;

        const updatedCriterion = await this.criteriaRepository.save(criterion);

        return updatedCriterion;
    }

    async deleteById (id_criteria: number): Promise<boolean> {

        if (!id_criteria) {
            throw new Error('Valores obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_criteria)) {
            throw new Error('Critério inválido');
        }

        const criterion = await this.criteriaRepository.findOne({
            where: {id_criteria},
        });

        if (!criterion) {
            throw new Error('Critério não existe');
        }

        await this.criteriaRepository.delete(id_criteria);

        return true;
    }
}

export { CriteriaService };