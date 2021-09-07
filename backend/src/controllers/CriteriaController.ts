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
            idPortfolio,
            description,
            weight,
            idUnities,
        } = request.body;

        try {
            const criterion = await singletonCriteria.getInstance().create(description, weight, Number(idPortfolio), Number(idUnities),);

            return response.json(criterion);

        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async show(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        try {
            const criteriaList = await singletonCriteria.getInstance().list(Number(id));
            return response.json(criteriaList);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async showById(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        try {
            const list = await singletonCriteria.getInstance().findById(Number(id));

            return response.json(list);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async updateById(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;
        const {
            description,
            weight,
            idPortfolio,
            idUnities,
        } = request.body;

        try {
            const updatedCriterion = await singletonCriteria.getInstance().updateById(description, weight, Number(idPortfolio), Number(idUnities), Number(id) );

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