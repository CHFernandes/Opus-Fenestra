import { Request, Response } from 'express';
import { CriteriaService } from '../services/CriteriaService';

const singletonCriteria = (function () {
    let instance: CriteriaService;
 
    function createInstance() {
        const criteriaService = new CriteriaService();
        return criteriaService;
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

class CriteriaController {


    async create(request: Request, response: Response): Promise<Response> {
        const { 
            description,
            weight,
            unityType,
            bestValue,
            worstValue,
        } = request.body;

        const criterion = await singletonCriteria.getInstance().create(description, weight, unityType, bestValue, worstValue);

        return response.json(criterion);
    }

    async show(request: Request, response: Response): Promise<Response> {
        const criteriaList = await singletonCriteria.getInstance().list();
        return response.json(criteriaList);
    }

    async showById(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        const list = await singletonCriteria.getInstance().findById(Number(id));

        return response.json(list);
    }

    async updateById(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        const {
            description,
            weight,
            unityType,
            bestValue,
            worstValue,
        } = request.body;
        try {
            const updatedCriterion = await singletonCriteria.getInstance().updateById(Number(id), description, weight, unityType, bestValue, worstValue);

            return response.json(updatedCriterion);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async deleteById(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        try {
            const responseDelete = await singletonCriteria.getInstance().deleteById(Number(id));
            return response.json(responseDelete);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }
}

export { CriteriaController };