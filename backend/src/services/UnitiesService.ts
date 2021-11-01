import { getConnection, getCustomRepository, Repository } from 'typeorm';
import { Unit } from '../entities/Unit';
import { UnitiesRepository } from '../repositories/UnitiesRepository';
import { CustomizedGrade } from '../entities/CustomizedGrade';
import { CustomizedGradesRepository } from '../repositories/CustomizedGradesRepository';
import { UnityGrade } from '../entities/UnityGrade';
import { UnityGradesRepository } from '../repositories/UnityGradesRepository';

type UnitListing = {
    id_unities: number;
    description: string;
    is_values_manual: boolean;
    best_value?: number | string;
    worst_value?: number | string;
};

type UnitListingGrades = {
    id_unities: number;
    description: string;
    is_values_manual: boolean;
    grades_list?: CustomizedGrade[];
};

class UnitiesService {
    private unitiesRepository: Repository<Unit>;
    private customizedGradesRepository: Repository<CustomizedGrade>;
    private unityGradesRepository: Repository<UnityGrade>;

    constructor() {
        this.unitiesRepository = getCustomRepository(UnitiesRepository);
        this.customizedGradesRepository = getCustomRepository(
            CustomizedGradesRepository
        );
        this.unityGradesRepository = getCustomRepository(UnityGradesRepository);
    }

    async create(
        description: string,
        is_values_manual: boolean
    ): Promise<Unit> {
        if (!description || is_values_manual === undefined) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        const unit = this.unitiesRepository.create({
            description,
            is_values_manual,
        });

        if (is_values_manual) {
            unit.best_manual_value = 10;
            unit.worst_manual_value = 0;
        }

        const unitResponse = await this.unitiesRepository.save(unit);

        return unitResponse;
    }

    async setBestAndWorstValues(
        id_unities: number,
        best_values: number,
        worst_values: number
    ): Promise<Unit> {
        if (!id_unities || !best_values || !worst_values) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_unities)) {
            throw new Error('Unidade inválida');
        }

        if (Number.isNaN(best_values)) {
            throw new Error('Nota inválida');
        }

        if (Number.isNaN(worst_values)) {
            throw new Error('Nota inválida');
        }

        const unit = await this.unitiesRepository.findOne({
            where: { id_unities },
        });

        if (!unit) {
            throw new Error('Unidade não existe');
        }

        const bestUnit = await this.customizedGradesRepository.findOne({
            where: {
                id_customized_grades: best_values,
            },
        });

        if (!bestUnit) {
            throw new Error('Nota não existe');
        }

        const worstUnit = await this.customizedGradesRepository.findOne({
            where: {
                id_customized_grades: worst_values,
            },
        });

        if (!worstUnit) {
            throw new Error('Nota não existe');
        }

        unit.best_values = best_values;
        unit.worst_values = worst_values;

        const updatedUnit = await this.unitiesRepository.save(unit);

        return updatedUnit;
    }

    async showAll(): Promise<UnitListing[]> {
        const unities = await this.unitiesRepository.find();

        const returnUnities = await Promise.all(
            unities.map(async (unit) => {
                const {
                    id_unities,
                    description,
                    best_values,
                    worst_values,
                    is_values_manual,
                    worst_manual_value,
                    best_manual_value,
                } = unit;

                const returnObject: UnitListing = {
                    id_unities,
                    description,
                    is_values_manual,
                };

                if (is_values_manual) {
                    returnObject.best_value = best_manual_value;
                    returnObject.worst_value = worst_manual_value;

                    return returnObject;
                }

                const bestUnit = await this.customizedGradesRepository.findOne({
                    where: {
                        id_customized_grades: best_values,
                    },
                });

                const worstUnit = await this.customizedGradesRepository.findOne(
                    {
                        where: {
                            id_customized_grades: worst_values,
                        },
                    }
                );

                returnObject.best_value = bestUnit.description;
                returnObject.worst_value = worstUnit.description;

                return returnObject;
            })
        );

        return returnUnities;
    }

    async showById(id_unities: number): Promise<UnitListingGrades> {
        if (!id_unities) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_unities)) {
            throw new Error('Unidade inválida');
        }

        const unit = await this.unitiesRepository.findOne({
            where: { id_unities },
        });

        if (unit.is_values_manual) {
            const returnUnitObject = {
                id_unities: unit.id_unities,
                description: unit.description,
                is_values_manual: unit.is_values_manual,
                grades_list: [],
            };

            return returnUnitObject;
        }

        const gradeList = await getConnection()
            .createQueryBuilder(CustomizedGrade, 'cg')
            .select('cg.id_customized_grades', 'id_customized_grades')
            .addSelect('cg.numeric_value', 'numeric_value')
            .addSelect('cg.description', 'description')
            .leftJoin(UnityGrade, 'ug')
            .where('ug.id_customized_grades = cg.id_customized_grades')
            .andWhere('ug.id_unities = :id_unities', { id_unities })
            .getRawMany();

        const returnUnitObject = {
            id_unities: unit.id_unities,
            description: unit.description,
            is_values_manual: unit.is_values_manual,
            grades_list: gradeList,
        };

        return returnUnitObject;
    }

    async updateById(
        id_unities: number,
        description: string,
        is_values_manual: boolean
    ): Promise<Unit> {
        if (!id_unities || !description || is_values_manual === undefined) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_unities)) {
            throw new Error('Unidade inválida');
        }

        const unit = await this.unitiesRepository.findOne({
            where: { id_unities },
        });

        if (!unit) {
            throw new Error('Unidade não existe');
        }

        unit.description = description;
        unit.is_values_manual = is_values_manual;

        unit.best_values = null;
        unit.worst_values = null;

        if (is_values_manual) {
            unit.worst_manual_value = 0;
            unit.best_manual_value = 10;
        } else {
            unit.best_manual_value = null;
            unit.worst_manual_value = null;
        }

        const updatedUnit = await this.unitiesRepository.save(unit);

        return updatedUnit;
    }

    async deleteById(id_unities: number): Promise<boolean> {
        if (!id_unities) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if (Number.isNaN(id_unities)) {
            throw new Error('Unidade inválida');
        }

        const unit = await this.unitiesRepository.findOne({
            where: { id_unities },
        });

        if (!unit) {
            throw new Error('Unidade não existe');
        }

        if (unit.is_values_manual) {
            await this.unitiesRepository.delete(id_unities);
            return true;
        }

        unit.best_values = null;
        unit.worst_values = null;

        await this.unitiesRepository.save(unit);

        const listUnityGrades = await this.unityGradesRepository.find({
            where: { id_unities },
        });

        for (let i = 0; i < listUnityGrades.length; i++) {
            const unityGrade = listUnityGrades[i];

            await this.unityGradesRepository.delete(unityGrade.id_unity_grade);
            await this.customizedGradesRepository.delete(
                unityGrade.id_customized_grades
            );
        }

        await this.unitiesRepository.delete(id_unities);
        return true;
    }
}

export { UnitiesService };
