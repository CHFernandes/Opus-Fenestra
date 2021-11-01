import { Request, Response } from 'express';
import { CustomizedGradesService } from '../services/CustomizedGradesService';

const singletonCustomizedGrades = (function () {
    let instance: CustomizedGradesService;

    function createInstance() {
        const customizedGradesService = new CustomizedGradesService();
        return customizedGradesService;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        },
    };
})();

class CustomizedGradesController {
    async create(request: Request, response: Response): Promise<Response> {
        const { idUnit, description, numericValue } = request.body;

        try {
            const customizedGrade = await singletonCustomizedGrades
                .getInstance()
                .create(Number(idUnit), description, Number(numericValue));

            return response.json(customizedGrade);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async updateById(request: Request, response: Response): Promise<Response> {
        const { id } = request.params;
        const { idUnit, description, numericValue } = request.body;

        try {
            const customizedGrade = await singletonCustomizedGrades
                .getInstance()
                .updateById(
                    Number(id),
                    Number(idUnit),
                    description,
                    Number(numericValue)
                );

            return response.json(customizedGrade);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async deleteById(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;

            const customizedGrade = await singletonCustomizedGrades
                .getInstance()
                .deleteById(Number(id));

            return response.json(customizedGrade);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }
}

export { CustomizedGradesController };
