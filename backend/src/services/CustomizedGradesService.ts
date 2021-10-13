import { getCustomRepository, Repository } from 'typeorm';
import { Unit } from '../entities/Unit';
import { UnitiesRepository } from '../repositories/UnitiesRepository';
import { CustomizedGrade } from '../entities/CustomizedGrade';
import { CustomizedGradesRepository } from '../repositories/CustomizedGradesRepository';
import { UnityGrade } from '../entities/UnityGrade';
import { UnityGradesRepository } from '../repositories/UnityGradesRepository';

class CustomizedGradesService {
    private unitiesRepository: Repository<Unit>;
    private customizedGradesRepository: Repository<CustomizedGrade>;
    private unityGradesRepository: Repository<UnityGrade>;

    constructor() {
        this.unitiesRepository = getCustomRepository(UnitiesRepository);
        this.customizedGradesRepository = getCustomRepository(CustomizedGradesRepository);
        this.unityGradesRepository = getCustomRepository(UnityGradesRepository);
    }

    async create(id_unities: number, description: string, numeric_value: number): Promise<CustomizedGrade> {

        if(!id_unities || !description || (numeric_value !== 0 && numeric_value == undefined )) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if(Number.isNaN(id_unities)) {
            throw new Error('Unidade inválida');
        }

        if(Number.isNaN(numeric_value)) {
            throw new Error('Valor numérico inválido');
        }

        const unit = await this.unitiesRepository.findOne({
            where: {id_unities},
        });

        if (!unit) {
            throw new Error('Unidade não existe');
        }

        const customizedGrade = this.customizedGradesRepository.create({
            description,
            numeric_value,
        });

        const customizedGradeResponse = await this.customizedGradesRepository.save(customizedGrade);

        const unityGrade = this.unityGradesRepository.create({
            id_unities,
            id_customized_grades: customizedGradeResponse.id_customized_grades
        });

        await this.unityGradesRepository.save(unityGrade);

        return customizedGradeResponse;
    }

    async updateById(id_customized_grades: number, id_unities: number, description: string, numeric_value: number): Promise<CustomizedGrade> {
        if(!id_customized_grades || !id_unities || !description || (numeric_value !== 0 && numeric_value == undefined )) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if(Number.isNaN(id_customized_grades)) {
            throw new Error('Nota inválida');
        }

        if(Number.isNaN(id_unities)) {
            throw new Error('Unidade inválida');
        }

        if(Number.isNaN(numeric_value)) {
            throw new Error('Valor numérico inválido');
        }

        const customGrade = await this.customizedGradesRepository.findOne({
            where: {id_customized_grades}
        });

        if (!customGrade) {
            throw new Error('Nota não existe');
        }

        const unit = await this.unitiesRepository.findOne({
            where: {id_unities},
        });

        if (!unit) {
            throw new Error('Unidade não existe');
        }

        const unitGrade = await this.unityGradesRepository.findOne({
            where: {id_unities, id_customized_grades}
        });

        if (!unitGrade) {
            throw new Error('Não existe ligação entre a nota e a unidade');
        }

        customGrade.description = description;
        customGrade.numeric_value = numeric_value;

        const updatedCustomGrade = await this.customizedGradesRepository.save(customGrade);

        return updatedCustomGrade;
    }

    async deleteById(id_customized_grades: number): Promise<boolean> {
        if(!id_customized_grades) {
            throw new Error('Campos obrigatórios não preenchidos');
        }

        if(Number.isNaN(id_customized_grades)) {
            throw new Error('Nota inválida');
        }

        const customGrade = await this.customizedGradesRepository.findOne({
            where: {id_customized_grades}
        });

        if (!customGrade) {
            throw new Error('Nota não existe');
        }

        const unityGradeToBeRemoved = await this.unityGradesRepository.findOne({
            where: {id_customized_grades}
        });

        await this.unityGradesRepository.delete(unityGradeToBeRemoved.id_unity_grade);

        await this.customizedGradesRepository.delete(id_customized_grades);

        return true;
    }

}

export {CustomizedGradesService};