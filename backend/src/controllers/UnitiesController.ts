import { Request, Response } from 'express';
import { UnitiesService } from '../services/UnitiesService';

const singletonUnities = (function () {
    let instance: UnitiesService;

    function createInstance() {
        const unitiesService = new UnitiesService();
        return unitiesService;
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

class UnitiesController {
    async create(request: Request, response: Response): Promise<Response> {
        try {
            const { description, isValuesManual } = request.body;

            const unit = await singletonUnities
                .getInstance()
                .create(description, Boolean(isValuesManual));

            return response.json(unit);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async setBestAndWorst(
        request: Request,
        response: Response
    ): Promise<Response> {
        try {
            const { id } = request.params;
            const { bestValue, worstValue } = request.body;

            const unit = await singletonUnities
                .getInstance()
                .setBestAndWorstValues(
                    Number(id),
                    Number(bestValue),
                    Number(worstValue)
                );

            return response.json(unit);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async list(request: Request, response: Response): Promise<Response> {
        try {
            const list = await singletonUnities.getInstance().showAll();

            return response.json(list);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async getById(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;

            const grade = await singletonUnities
                .getInstance()
                .showById(Number(id));

            return response.json(grade);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async updateById(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;
            const { description, isValuesManual } = request.body;

            const unit = await singletonUnities
                .getInstance()
                .updateById(Number(id), description, Boolean(isValuesManual));

            return response.json(unit);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }

    async deleteById(request: Request, response: Response): Promise<Response> {
        try {
            const { id } = request.params;

            const responseDeletion = await singletonUnities
                .getInstance()
                .deleteById(Number(id));

            return response.json(responseDeletion);
        } catch (err) {
            return response.status(400).json({
                message: err.message,
            });
        }
    }
}

export { UnitiesController };
