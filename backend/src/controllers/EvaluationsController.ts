import { Request, Response } from 'express';
import { EvaluationsService } from '../services/EvaluationsService';

const singletonEvaluations = (function () {
    let instance: EvaluationsService;
 
    function createInstance() {
        const evaluationService = new EvaluationsService();
        return evaluationService;
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

class EvaluationsController {
    async evaluate(request: Request, response: Response): Promise<Response> {
        const { 
            projectId,
            criteriaId,
            evaluationDate,
            value,
        } = request.body;

        try {
            const evaluation = await singletonEvaluations.getInstance().evaluate(Number(projectId), Number(criteriaId), evaluationDate, Number(value));

            return response.json(evaluation);

        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async updateEvaluation(request: Request, response: Response): Promise<Response> {
        const { 
            projectId,
            personId
        } = request.body;

        try {
            const updatedEvaluation = await singletonEvaluations.getInstance().updateEvaluation(Number(projectId), Number(personId));

            return response.json(updatedEvaluation);

        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async showLastEvaluations(request: Request, response: Response): Promise<Response> {
        const {id} = request.params;

        try {
            const list = await singletonEvaluations.getInstance().getLastEvaluations(Number(id));

            return response.json(list);

        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }
}

export { EvaluationsController };